import { sql, sanitizeText } from "@/components/db";
import sha1 from "sha1";
import { summarizeProposal } from "@/components/ai/summary";
import { labelProposal } from "@/components/ai/labeler";
import { createClient } from "@supabase/supabase-js";
import { PROPOSAL_CLASSES } from "@/constants/proposalClasses";

export const maxDuration = 60;

export async function POST(req) {
    const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
    );

    try {
        let protocols = [];

        const body = await req.json().catch(() => null);

        var { data, error } = await supabase.from("protocols").select("id");
        if (error) {
            console.log(error);
            return Response.json(
                {
                    status: "error",
                },
                { status: 403 },
            );
        }
        let existingProtocols = new Set(data.map((p) => p.id));

        const protocolsURL = `https://api.boardroom.info/v1/protocols?key=${process.env.BOARDROOM_API_KEY}`;
        const protocolsOptions = {
            method: "GET",
            headers: { Accept: "application/json" },
        };

        let protocolsResponse = await fetch(protocolsURL, protocolsOptions);
        let protocolsData = await protocolsResponse.json();
        protocolsData = protocolsData.data;

        // if "procotol" is in the request body, only upload proposals for the specified protocol
        if (body && body.protocol) {
            console.log("Only uploading proposals for ", body.protocol);
            protocolsData = protocolsData.filter(
                ({ cname }) => cname == body.protocol,
            );
        }

        for (let i = 0; i < protocolsData.length; i++) {
            if (protocolsData[i] && protocolsData[i].icons !== undefined) {
                protocols.push(sanitizeText(protocolsData[i].cname));
            }
        }

        // add newly discovered protocols to db
        let newProtocolsData = protocolsData.filter(
            ({ cname }) => !existingProtocols.has(cname),
        );
        if (newProtocolsData) {
            console.log(
                "Discovered new protocols: ",
                newProtocolsData.map((p) => p.cname),
            );
            var { data, error } = await supabase.from("protocols").upsert(
                newProtocolsData.map((d) => ({
                    id: d.cname,
                    name: d.name,
                    icon: d.icons ? d.icons[0].url : "",
                })),
                {
                    onConflict: "id",
                    ignoreDuplicates: false,
                },
            );

            if (error) {
                console.log(error);
                return Response.json(
                    {
                        status: "error",
                    },
                    { status: 403 },
                );
            }
        }

        let existingProposals = [];
        var { data, error } = await supabase.from("proposals").select("id");
        if (error) console.log(error);
        else existingProposals = data.map((p) => p.id);

        // get active proposals for each protocol
        let proposalDbEntries = [];
        const proposalPromises = protocols.map(async (protocol) => {
            const proposalsURL = `https://api.boardroom.info/v1/protocols/${protocol}/proposals?status=active&key=${process.env.BOARDROOM_API_KEY}`;
            const proposalsOptions = {
                method: "GET",
                headers: { Accept: "application/json" },
            };

            const proposalsResponse = await fetch(
                proposalsURL,
                proposalsOptions,
            );
            const proposalsData = await proposalsResponse.json();

            for (let i = 0; i < proposalsData.data.length; i += 1) {
                const rawProposal = proposalsData.data[i];

                // filter out proposals which are already in Tribuni db
                if (
                    existingProposals.includes(calculateProposalId(rawProposal))
                )
                    continue;

                let proposalDbEntry = await fromRawProposal(
                    rawProposal,
                    protocol,
                );
                if (proposalDbEntry.title !== undefined) {
                    proposalDbEntries.push(proposalDbEntry);
                }
            }
        });

        await Promise.allSettled(proposalPromises);

        // filter out repeated proposals in boardroom API response
        let newProposalIds = new Set();
        proposalDbEntries = Array.from(proposalDbEntries).filter(
            ({ protocol, id }) => {
                let identifier = protocol + "$salt$" + id;
                if (newProposalIds.has(identifier)) {
                    return false;
                } else {
                    newProposalIds.add(identifier);
                    return true;
                }
            },
        );

        console.log("Adding new proposals:", proposalDbEntries.length);

        var { data, error } = await supabase.from("proposals").upsert(
            proposalDbEntries.map(
                ({
                    id,
                    protocol,
                    proposer,
                    title,
                    starttime,
                    endtime,
                    url,
                    raw_summary,
                    summary,
                    was_summarized,
                    choices,
                    results,
                }) => ({
                    id,
                    protocol,
                    proposer,
                    title,
                    starttime,
                    endtime,
                    url,
                    raw_summary,
                    summary,
                    was_summarized,
                    choices,
                    results,
                }),
            ),
            {
                onConflict: "id",
                ignoreDuplicates: false,
            },
        );

        if (error) {
            console.log(error);
            return Response.json(
                {
                    status: "error",
                },
                { status: 403 },
            );
        }

        return Response.json(
            {
                status: "success",
            },
            { status: 201 },
        );
    } catch (err) {
        console.log(err);
        return Response.json(
            {
                status: "error",
            },
            { status: 403 },
        );
    }
}

async function fromRawProposal(rawProposal, protocol) {
    let dbEntry = {};
    dbEntry["id"] = calculateProposalId(rawProposal);
    dbEntry["protocol"] = protocol;
    dbEntry["proposer"] = rawProposal.proposer;
    dbEntry["title"] = sanitizeText(rawProposal.title).trim();
    dbEntry["starttime"] = parseInt(rawProposal.startTimestamp);
    dbEntry["endtime"] = parseInt(rawProposal.endTimestamp);
    dbEntry["url"] = rawProposal.externalUrl;

    if (!dbEntry["url"]) {
        // Boardroom does not know the voting URL for some protocols. Manually enter them here
        if (protocol == "optimism") {
            dbEntry[
                "url"
            ] = `https://vote.optimism.io/proposals/${rawProposal.id}`;
        } else if (protocol == "arbitrum") {
            dbEntry[
                "url"
            ] = `https://www.tally.xyz/gov/arbitrum/proposal/${rawProposal.id}`;
        }
    }

    if (
        rawProposal["content"] == "" ||
        rawProposal["content"] == null ||
        rawProposal["content"] == undefined
    ) {
        dbEntry["raw_summary"] = "No content available.";
        dbEntry["summary"] = "No content available.";
        dbEntry["was_summarized"] = false;
    } else {
        let sanitizedContent = sanitizeText(rawProposal["content"]).trim();
        if (sanitizedContent.length > 200)
            dbEntry["raw_summary"] = sanitizedContent.slice(0, 200) + "...";
        else dbEntry["raw_summary"] = sanitizedContent;

        try {
            dbEntry["summary"] = await summarizeProposal(
                dbEntry["raw_summary"],
            );
            dbEntry["was_summarized"] = true;
        } catch (err) {
            dbEntry["summary"] = dbEntry["raw_summary"];
            dbEntry["was_summarized"] = false;
        }
    }

    dbEntry["choices"] = rawProposal.choices.map((choice) =>
        sanitizeText(choice).trim(),
    );
    dbEntry["results"] = rawProposal.indexedResult;

    try {
        const labelResponse = await labelProposal(dbEntry["summary"]);
        dbEntry["proposal_class"] = santizieProposalLabel(labelResponse);
    } catch (err) {
        dbEntry["proposal_class"] = "Other";
    }

    return dbEntry;
}

function calculateProposalId(rawProposal) {
    return sha1(rawProposal.id);
}

function santizieProposalLabel(label) {
    let result;
    for (let i = 0; i < PROPOSAL_CLASSES.length; i++) {
        if (label.toLowerCase().includes(PROPOSAL_CLASSES[i].toLowerCase())) {
            result = PROPOSAL_CLASSES[i];
            break;
        }
    }
    if (!result) result = "Other";
    return result;
}
