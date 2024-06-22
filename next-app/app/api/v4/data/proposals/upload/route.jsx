import { sql, sanitizeText } from "@/components/db";
import sha1 from "sha1";
import { summarizeProposal } from "@/components/ai/summary";
import { createClient } from "@supabase/supabase-js";

export const maxDuration = 60;
var supabase = null;

/*
The /data/proposals/upload endpoint does the following:
1. Fetches all live proposals from BoardRoom API
   It first fetches a list of protocols, then fetches proposals for each protocol
   If `protocol` parameter is provided, only fetch proposals for the specified protocol
2. Update db record for each proposal already known to Tribuni
   Create a new db record for each proposal not known to Tribuni

Request Body: {
    protocol: string
}
*/
export async function POST(req) {
    // parse request body
    var requestBody;
    try {
        requestBody = await req.json().catch(() => null);
    } catch (err) {
        const message = `failed to parse request body: ${err}`;
        console.log(message);
        return Response.json({ message }, { status: 400 });
    }

    // initialize database
    if (!supabase) {
        try {
            initDatabase();
        } catch (err) {
            const message = `could not initialize database: ${err}`;
            console.log(message);
            return Response.json({ message }, { status: 503 });
        }
    }

    // fetch supported protocols from Boardroom API
    let protocolsData = [];
    try {
        protocolsData = await getProtocolsFromBoardroom();
    } catch (err) {
        const message = `could not get protocols from database: ${err}`;
        console.log(message);
        return Response.json({ message }, { status: 503 });
    }
    // protocols without an icon image URL are ignored
    protocolsData = protocolsData.filter(({ icons }) => icons && icons.length);

    // if "procotol" is in the request body, only handle proposals for the specified protocol
    if (requestBody && requestBody.protocol) {
        console.log("Only uploading proposals for ", requestBody.protocol);
        protocolsData = protocolsData.filter(
            ({ cname }) => cname == requestBody.protocol,
        );

        if (!protocolsData) {
            const message = `${requestBody.protocol} is not a supported protocol`;
            console.log(message);
            return Response.json({ message }, { status: 400 });
        }
    }

    let protocolNames = protocolsData.map((protocolData) => protocolData.cname);

    // get known protocolIds from database
    var { data, err } = await supabase.from("protocols").select("id");
    if (err) {
        const message = `could not get protocols from database: ${err}`;
        console.log(message);
        return Response.json({ message }, { status: 503 });
    }
    const existingProtocolNames = new Set(data.map((p) => p.id));
    // console.log(newProtocolsData)

    // add newly discovered protocols to db, if any
    let newProtocolsData = protocolsData.filter(
        ({ cname }) => !existingProtocolNames.has(cname),
    );
    if (newProtocolsData.length) {
        console.log(
            "Adding new protocols to database: ",
            newProtocolsData.map((p) => p.cname),
        );
        var { data, err } = await upsertProtocolsData(newProtocolsData);

        if (err) {
            const message = `could not upload new protocols to database: ${error}`;
            console.log(message);
            return Response.json({ message }, { status: 503 });
        }
    }

    // read all existing proposals from Tribuni db
    var { data: existingProposals, err } = await supabase
        .from("proposals")
        .select("*");
    if (err) {
        const message = `could not fetch proposals from database: ${err}`;
        console.log(message);
        return Response.json({ message }, { status: 503 });
    }
    const existingProposalsMap = new Map();
    existingProposals.forEach((proposal) =>
        existingProposalsMap.set(proposal.id, proposal),
    );
    const existingProposalIds = Array.from(existingProposalsMap.keys());

    // get active proposals from Boardroom
    let proposalEntriesToUpdate = [];
    let proposalEntriesToCreate = [];
    const proposalPromises = protocolNames.map(async (protocolName) => {
        let proposalsData = await getProposalsFromBoardroom(protocolName);
        proposalsData = proposalsData.data;
        // filter out repeated proposals from the response
        proposalsData = [
            ...proposalsData
                .reduce(
                    (map, proposalData) =>
                        map.set(proposalData.id, proposalData),
                    new Map(),
                )
                .values(),
        ];

        for (const proposalData of proposalsData) {
            let proposalId = calculateProposalId(proposalData);
            var proposalDbEntry;
            if (existingProposalIds.includes(proposalId)) {
                // if the proposal is already in Tribuni db, update its metadata, but do not create a new AI summary
                proposalDbEntry = await fromRawProposal(
                    proposalData,
                    existingProposalsMap.get(proposalId),
                    protocolName,
                );
                if (proposalDbEntry) {
                    proposalEntriesToUpdate.push(proposalDbEntry);
                }
            } else {
                // if the proposal is new, create a new AI summary
                proposalDbEntry = await fromRawProposal(
                    proposalData,
                    null,
                    protocolName,
                );
                if (proposalDbEntry) {
                    proposalEntriesToCreate.push(proposalDbEntry);
                }
            }
        }
    });

    await Promise.allSettled(proposalPromises);
    console.log(
        `Adding ${proposalEntriesToCreate.length} proposals and updating ${proposalEntriesToUpdate.length} proposals`,
    );

    // upsert all updated entries to the db
    const proposalEntriesToUpsert = proposalEntriesToCreate.concat(
        proposalEntriesToUpdate,
    );
    var { data, err } = await upsertProposalData(proposalEntriesToUpsert);

    if (err) {
        const message = `could not upload proposal updates to database: ${err}`;
        console.log(message);
        return Response.json({ message }, { status: 503 });
    }

    return Response.json({ message: "success" }, { status: 201 });
}

// update existingProposalDbEntry with information from rawProposal
// if existingProposalDbEntry is null, the proposal is new
async function fromRawProposal(
    rawProposal,
    existingProposalDbEntry,
    protocolName,
) {
    let updatedDbEntry = existingProposalDbEntry || {};
    updatedDbEntry["id"] = calculateProposalId(rawProposal);
    updatedDbEntry["protocol"] = protocolName;
    updatedDbEntry["proposer"] = rawProposal.proposer;
    updatedDbEntry["title"] = sanitizeText(rawProposal.title).trim();
    updatedDbEntry["starttime"] = parseInt(rawProposal.startTimestamp);
    updatedDbEntry["endtime"] = parseInt(rawProposal.endTimestamp);
    updatedDbEntry["url"] = updatedDbEntry["url"] || rawProposal.externalUrl;

    if (!updatedDbEntry["url"]) {
        // Boardroom does not know the voting URL for some protocols. Manually enter them here
        if (protocolName == "optimism") {
            updatedDbEntry["url"] =
                `https://vote.optimism.io/proposals/${rawProposal.id}`;
        } else if (protocolName == "arbitrum") {
            updatedDbEntry["url"] =
                `https://www.tally.xyz/gov/arbitrum/proposal/${rawProposal.id}`;
        } else if (protocolName == "aave") {
            const proposalRawId = parseInt(rawProposal.id, 10);
            if (!isNaN(proposalRawId)) {
                updatedDbEntry["url"] =
                    `https://app.aave.com/governance/v3/proposal/?proposalId=${proposalRawId}`;
            }
        } else {
            updatedDbEntry["url"] =
                `https://www.google.com/search?q=${protocolName} ${updatedDbEntry["title"]}`;
        }
    }

    if (!updatedDbEntry["was_summarized"]) {
        if (
            rawProposal["content"] == "" ||
            rawProposal["content"] == null ||
            rawProposal["content"] == undefined
        ) {
            updatedDbEntry["raw_summary"] = "No content available.";
            dbEupdatedDbEntryntry["summary"] = "No content available.";
            updatedDbEntry["was_summarized"] = false;
        } else {
            let sanitizedContent = sanitizeText(rawProposal["content"]).trim();
            if (sanitizedContent.length > 200)
                updatedDbEntry["raw_summary"] =
                    sanitizedContent.slice(0, 200) + "...";
            else updatedDbEntry["raw_summary"] = sanitizedContent;

            try {
                updatedDbEntry["summary"] = await summarizeProposal(
                    updatedDbEntry["raw_summary"],
                );
                updatedDbEntry["was_summarized"] = true;
            } catch (err) {
                updatedDbEntry["summary"] = dbEntry["raw_summary"];
                updatedDbEntry["was_summarized"] = false;
            }
        }
    }

    updatedDbEntry["choices"] = rawProposal.choices.map((choice) =>
        sanitizeText(choice).trim(),
    );
    updatedDbEntry["results"] = rawProposal.indexedResult;
    return updatedDbEntry;
}

function calculateProposalId(rawProposal) {
    return sha1(rawProposal.id);
}

async function getProtocolsFromBoardroom() {
    const protocolsURL = `https://api.boardroom.info/v1/protocols?key=${process.env.BOARDROOM_API_KEY}`;
    const protocolsOptions = {
        method: "GET",
        headers: { Accept: "application/json" },
    };
    const protocolsResponse = await fetch(protocolsURL, protocolsOptions);
    const protocolsResJson = await protocolsResponse.json();
    return protocolsResJson.data;
}

async function getProposalsFromBoardroom(protocolName) {
    const proposalsURL = `https://api.boardroom.info/v1/protocols/${protocolName}/proposals?status=active&key=${process.env.BOARDROOM_API_KEY}`;
    const proposalsOptions = {
        method: "GET",
        headers: { Accept: "application/json" },
    };
    const proposalsResponse = await fetch(proposalsURL, proposalsOptions);
    return await proposalsResponse.json();
}

function initDatabase() {
    supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
    );
}

async function upsertProtocolsData(protocolsData) {
    return await supabase.from("protocols").upsert(
        protocolsData.map((d) => ({
            id: d.cname,
            name: d.name,
            icon: d.icons ? d.icons[0].url : "",
        })),
        {
            onConflict: "id",
            ignoreDuplicates: false,
        },
    );
}

async function upsertProposalData(proposalData) {
    return await supabase.from("proposals").upsert(
        proposalData.map(
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
}
