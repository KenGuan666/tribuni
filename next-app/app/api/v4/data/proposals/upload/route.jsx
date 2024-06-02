import { sql, sanitizeText } from "@/components/db";
import sha1 from "sha1";
import { summarizeProposal } from "@/components/ai/summary";
import { createClient } from '@supabase/supabase-js';

export const maxDuration = 60;

export async function POST(req) {

	const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

	try {

		const protocolsURL = `https://api.boardroom.info/v1/protocols?key=${process.env.BOARDROOM_API_KEY}`;
		const protocolsOptions = {
			method: "GET",
			headers: { Accept: "application/json" },
		};

		let protocolsResponse = await fetch(protocolsURL, protocolsOptions);
		let protocolsData = await protocolsResponse.json();
		protocolsData = protocolsData.data;

		let protocols = [];
		for (let i = 0; i < protocolsData.length; i++) {
			if (protocolsData[i] && protocolsData[i].icons !== undefined) {
				protocols.push(sanitizeText(protocolsData[i].cname));
			}
		}

		let existingProposals = [];
		var { data, error } = await supabase.from('proposals').select('id');
		if (error) console.log(error);
		else existingProposals = data.map((p) => p.id);

		let proposalDbEntries = [];
		const proposalPromises = protocols.map(async (protocol) => {

			const proposalsURL = `https://api.boardroom.info/v1/protocols/${protocol}/proposals?status=active&key=${process.env.BOARDROOM_API_KEY}`;
			const proposalsOptions = {
				method: "GET",
				headers: { Accept: "application/json" },
			};

			const proposalsResponse = await fetch(proposalsURL, proposalsOptions);
			const proposalsData = await proposalsResponse.json();

			for (let i = 0; i < proposalsData.data.length; i += 1) {

				const rawProposal = proposalsData.data[i];

				// check that the proposal doesn't already exist
				if (existingProposals.includes(sha1(rawProposal.id))) continue;

				let proposalDbEntry = fromRawProposal(rawProposal, protocol);
				if (proposalDbEntry.title !== undefined) {
					proposalDbEntries.push(proposalDbEntry);
				}
			}
		});

		await Promise.allSettled(proposalPromises);

		let newProposalIds = new Set();

		proposalDbEntries = Array.from(proposalDbEntries).filter(({ id }) => {
			if (newProposalIds.has(id)) {
				return false;
			} else {
				newProposalIds.add(id);
				return true;
			}
		});

		var { data, error } = await supabase
			.from('proposals')
			.upsert(
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
						results
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
						results
					})
				),
				{
					onConflict: 'id',
					ignoreDuplicates: false,
				}
			);

		if (error) {
			console.log(error);
			return Response.json({
				code: 403,
				status: "error",
			});
		}

		return Response.json({
			code: 201,
			status: "success"
		});

	} catch (err) {
		console.log(err);
		return Response.json({
			code: 403,
			status: "error",
		});
	}
}

async function fromRawProposal(rawProposal, protocol) {
	let dbEntry = {}
	dbEntry["id"] = sha1(rawProposal.id);
	dbEntry["protocol"] = protocol;
	dbEntry["proposer"] = rawProposal.proposer;
	dbEntry["title"] = sanitizeText(rawProposal.title).trim();
	dbEntry["starttime"] = parseInt(rawProposal.startTimestamp);
	dbEntry["endtime"] = parseInt(rawProposal.endTimestamp);
	dbEntry["url"] = rawProposal.externalUrl;

	if (!dbEntry["url"]) {
		// Boardroom does not know the voting URL for some protocols. Manually enter them here
		if (protocol == "optimism") {
			dbEntry["url"] = `https:///vote.optimism.io/proposals/${rawProposal.id}`
		}
	}

	if (rawProposal["content"] == "" || rawProposal["content"] == null || rawProposal["content"] == undefined) {

		dbEntry["raw_summary"] = "No content available.";
		dbEntry["summary"] = "No content available.";
		dbEntry["was_summarized"] = false;

	} else {

		let sanitizedContent = sanitizeText(rawProposal["content"]).trim();
		if (sanitizedContent.length > 200) dbEntry["raw_summary"] = sanitizedContent.slice(0, 200) + "...";
		else dbEntry["raw_summary"] = sanitizedContent;

		try {
			dbEntry["summary"] = await summarizeProposal(dbEntry["raw_summary"]);
			dbEntry["was_summarized"] = true;
		} catch (err) {
			dbEntry["summary"] = dbEntry["raw_summary"];
			dbEntry["was_summarized"] = false;
		}
	}

	dbEntry["choices"] = rawProposal.choices.map((choice) => sanitizeText(choice).trim());
	dbEntry["results"] = rawProposal.indexedResult;
	return dbEntry
}
