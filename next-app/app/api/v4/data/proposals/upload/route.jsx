import { sanitizeText } from "@/components/db";
import sha1 from "sha1";
import { summarizeProposal } from "@/components/ai/summary";
import { labelProposal } from "@/components/ai/proposalClassLabel";
import {
    getSupabase,
    upsertProtocolsData,
    upsertProposalData,
} from "@/components/db/supabase";
import {
    PROPOSAL_CLASSES,
    PROPOSAL_CLASS_OTHER,
} from "@/constants/proposalClasses";
import { bookmarkAndAlertForSubscribers } from "./bookmarkAndAlert";
import {
    getProposalsFromBoardroom,
    getProtocolsFromBoardroom,
} from "./boardroom";
import { populateFallbackUrl } from "./url";
import { timestampNow } from "@/utils/time";

export const maxDuration = 300;
const NO_SUMMARY_FILLER_TEXT = "No content available.";

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
    var supabase;
    try {
        requestBody = await req.json();
    } catch (err) {
        requestBody = {}
    }

    // initialize database
    if (!supabase) {
        try {
            supabase = getSupabase();
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
        const message = `could not get protocols from boardroom: ${err}`;
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
    console.log("new protocols:", newProtocolsData.map((p) => p.cname))
    if (newProtocolsData.length) {
        console.log(
            "Adding new protocols to database: ",
            newProtocolsData.map((p) => p.cname),
        );
        var { data, err } = await upsertProtocolsData(
            supabase,
            newProtocolsData,
        );

        if (err) {
            const message = `could not upload new protocols to database: ${err}`;
            console.log(message);
            console.log(err);
            return Response.json({ message }, { status: 503 });
        }
    }

    // read all existing proposals from Tribuni db
    const timeNow = timestampNow();
    var { data: existingProposals, err } = await supabase
        .from("proposals")
        .select("*")
        .gt("endtime", timeNow);
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
    console.log("existingProposalIds", existingProposalIds)

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
    var err = await upsertProposalData(supabase, proposalEntriesToUpsert);
    if (err) {
        const message = `could not upload proposal updates to database: ${err}`;
        console.log(message);
        console.log(err);
        return Response.json({ message }, { status: 503 });
    }

    // for each new proposal, bookmark them for subscribed users
    err = await bookmarkAndAlertForSubscribers(
        supabase,
        proposalEntriesToCreate,
    );
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
