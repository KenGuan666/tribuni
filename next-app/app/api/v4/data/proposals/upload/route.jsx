import { sanitizeText } from "@/components/db";
import sha1 from "sha1";
import { summarizeProposal } from "@/components/ai/summary";
import { labelProposal } from "@/components/ai/proposalClassLabel";
import { createClient } from "@supabase/supabase-js";
import {
    PROPOSAL_CLASSES,
    PROPOSAL_CLASS_OTHER,
} from "@/constants/proposalClasses";
import { bookmarkForSubscribers } from "./bookmarkUpdate";

export const maxDuration = 300;
const NO_SUMMARY_FILLER_TEXT = "No content available.";
var supabase = null;

/*
The /data/proposals/upload endpoint does the following:
1. Fetches all live proposals from BoardRoom API
   It first fetches a list of protocols, then fetches proposals for each protocol
   If `protocol` parameter is provided, only fetch proposals for the specified protocol
2. Update db record for each proposal already known to Tribuni
   Create a new db record for each proposal not known to Tribuni
3. For each new proposal, bookmark it for users who subscribed to its protocol

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
        console.log(err);
        return Response.json({ message }, { status: 400 });
    }

    // initialize database
    if (!supabase) {
        try {
            initDatabase();
        } catch (err) {
            const message = `could not initialize database: ${err}`;
            console.log(message);
            console.log(err);
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
        console.log(err);
        return Response.json({ message }, { status: 503 });
    }
    // protocols without an icon image URL are ignored
    protocolsData = protocolsData.filter(({ icons }) => icons && icons.length);

    // if "procotol" is in the request body, only handle proposals for the specified protocol
    if (requestBody && requestBody.protocol) {
        console.log(`Only uploading proposals for ${requestBody.protocol}`);
        protocolsData = protocolsData.filter(
            ({ cname }) => cname == requestBody.protocol,
        );

        if (!protocolsData) {
            const message = `${requestBody.protocol} is not a supported protocol`;
            console.log(message);
            console.log(err);
            return Response.json({ message }, { status: 400 });
        }
    }

    let protocolIds = protocolsData.map((protocolData) => protocolData.cname);

    // get known protocolIds from database
    var { data, err } = await supabase.from("protocols").select("id");
    if (err) {
        const message = `could not get protocols from database: ${err}`;
        console.log(message);
        console.log(err);
        return Response.json({ message }, { status: 503 });
    }
    const existingProtocolIds = new Set(data.map((p) => p.id));

    // add newly discovered protocols to db, if any
    let newProtocolsData = protocolsData.filter(
        ({ cname }) => !existingProtocolIds.has(cname),
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
            console.log(err);
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
        console.log(err);
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
    const proposalPromises = protocolIds.map(async (protocolId) => {
        let proposalsData = await getProposalsFromBoardroom(protocolId);
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
                // if the proposal is already in Tribuni db, only update its metadata which has changed
                proposalDbEntry = await fromRawProposal(
                    proposalData,
                    existingProposalsMap.get(proposalId),
                    protocolId,
                );
                if (proposalDbEntry) {
                    proposalEntriesToUpdate.push(proposalDbEntry);
                }
            } else {
                // if the proposal is new, create a new AI summary and corresponding proposal class label
                proposalDbEntry = await fromRawProposal(
                    proposalData,
                    null,
                    protocolId,
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
    var err = await upsertProposalData(proposalEntriesToUpsert);
    if (err) {
        const message = `could not upload proposal updates to database: ${err}`;
        console.log(message);
        console.log(err);
        return Response.json({ message }, { status: 503 });
    }

    // for each new proposal, bookmark them for subscribed users
    err = await bookmarkForSubscribers(supabase, proposalEntriesToCreate);
    if (err) {
        const message = `could not bookmark new proposals for subscribed users: ${err}`;
        console.log(message);
        console.log(err);
        return Response.json({ message }, { status: 503 });
    }
    return Response.json({ message: "success" }, { status: 201 });
}

// update existingProposalDbEntry with information from rawProposal
// if existingProposalDbEntry is null, the proposal is new
async function fromRawProposal(
    rawProposal,
    existingProposalDbEntry,
    protocolId,
) {
    let updatedDbEntry = existingProposalDbEntry || {};

    // sanitize and copy over fields from rawProposal
    updatedDbEntry["id"] =
        updatedDbEntry["id"] || calculateProposalId(rawProposal);
    updatedDbEntry["protocol"] = protocolId;
    updatedDbEntry["proposer"] = rawProposal.proposer;
    updatedDbEntry["title"] = sanitizeText(rawProposal.title).trim();
    updatedDbEntry["starttime"] = parseInt(rawProposal.startTimestamp);
    updatedDbEntry["endtime"] = parseInt(rawProposal.endTimestamp);
    updatedDbEntry["url"] = updatedDbEntry["url"] || rawProposal.externalUrl;
    updatedDbEntry["choices"] = rawProposal.choices.map((choice) =>
        sanitizeText(choice).trim(),
    );
    updatedDbEntry["results"] = rawProposal.indexedResult;

    if (!updatedDbEntry["url"]) {
        // Boardroom does not know the voting URL for some protocols. Use fallback logic to find some url
        populateFallbackUrl(updatedDbEntry, rawProposal);
    }

    if (!updatedDbEntry["was_summarized"]) {
        await populateProposalSummary(updatedDbEntry, rawProposal["content"]);
    }

    if (!updatedDbEntry["proposal_class"]) {
        await populateProposalClass(updatedDbEntry);
    }

    return updatedDbEntry;
}

/*
    calculateProposalId: create a unique id for each proposal
*/
function calculateProposalId(rawProposal) {
    return sha1(rawProposal.id);
}

/*
    populateFallbackUrl: identify a reasonable "Vote Now" link if Boardroom API doesn't provide one
    The fallback logic is per-protocol. If there's no good logic, fallback to linking a Google search result
*/
function populateFallbackUrl(dbEntry, rawProposal) {
    const protocolId = dbEntry.protocol;
    if (protocolId == "optimism") {
        dbEntry["url"] = `https://vote.optimism.io/proposals/${rawProposal.id}`;
    } else if (protocolId == "arbitrum") {
        dbEntry["url"] =
            `https://www.tally.xyz/gov/arbitrum/proposal/${rawProposal.id}`;
    } else if (protocolId == "aave") {
        const proposalRawId = parseInt(rawProposal.id, 10);
        if (!isNaN(proposalRawId)) {
            dbEntry["url"] =
                `https://app.aave.com/governance/v3/proposal/?proposalId=${proposalRawId}`;
        }
    } else {
        dbEntry["url"] =
            `https://www.google.com/search?q=${protocolId} ${dbEntry["title"]}`;
    }
}

/*
    populateProposalSummary: create and save an AI summary of the proposal
*/
async function populateProposalSummary(dbEntry, rawContentStr) {
    if (!rawContentStr) {
        dbEntry["raw_summary"] = NO_SUMMARY_FILLER_TEXT;
        dbEntry["summary"] = NO_SUMMARY_FILLER_TEXT;
        dbEntry["was_summarized"] = false;
        return;
    }

    let sanitizedContent = sanitizeText(rawContentStr).trim();
    if (sanitizedContent.length > 200)
        dbEntry["raw_summary"] = sanitizedContent.slice(0, 200) + "...";
    else dbEntry["raw_summary"] = sanitizedContent;

    try {
        dbEntry["summary"] = await summarizeProposal(dbEntry["raw_summary"]);
        dbEntry["was_summarized"] = true;
    } catch (err) {
        dbEntry["summary"] = dbEntry["raw_summary"];
        dbEntry["was_summarized"] = false;
    }
}

/*
    populateProposalClass: create and save an AI-created proposal class label of the proposal
*/
async function populateProposalClass(dbEntry) {
    var label, summary;
    if (!dbEntry["was_summarized"]) {
        if (dbEntry["raw_summary"] === NO_SUMMARY_FILLER_TEXT) {
            dbEntry["proposal_class"] = PROPOSAL_CLASS_OTHER;
            return;
        }
        summary = dbEntry["raw_summary"];
    } else {
        summary = dbEntry["summary"];
    }
    try {
        label = await labelProposal(summary);
    } catch (err) {
        // in case of openAI error, do not label the proposal and wait for next update
        console.log(err);
        return;
    }

    // make sure the label is one of the predefined classes
    const label_lowercase = label.toLowerCase();
    for (const _class of PROPOSAL_CLASSES) {
        if (label_lowercase.includes(_class.toLowerCase())) {
            dbEntry["proposal_class"] = label;
            return;
        }
    }
    dbEntry["proposal_class"] = PROPOSAL_CLASS_OTHER;
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

async function getProposalsFromBoardroom(protocolId) {
    const proposalsURL = `https://api.boardroom.info/v1/protocols/${protocolId}/proposals?status=active&key=${process.env.BOARDROOM_API_KEY}`;
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

async function upsertProposalData(proposalsData) {
    const batchSize = 20;
    for (let i = 0; i < proposalsData.length; i += batchSize) {
        let { err } = upsertProposalDataDb(
            proposalsData.slice(i, i + batchSize),
        );
        if (err) {
            return err;
        }
    }
}

async function upsertProposalDataDb(proposalsData) {
    return await supabase.from("proposals").upsert(
        proposalsData.map(
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
                proposal_class,
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
                proposal_class,
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
