import { sql, sanitizeText } from "@/components/db";
import sha1 from "sha1";
import { summarizeProposal } from "@/components/ai/summary";
import { createClient } from '@supabase/supabase-js';

export const config = {
	maxDuration: 60,
};

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

		let newProposals = [];
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

				let newProposal = {};

				newProposal["id"] = sha1(rawProposal.id);
				newProposal["protocol"] = protocol;
				newProposal["proposer"] = rawProposal.proposer;
				newProposal["title"] = sanitizeText(rawProposal.title).trim();
				newProposal["starttime"] = parseInt(rawProposal.startTimestamp);
				newProposal["endtime"] = parseInt(rawProposal.endTimestamp);
				newProposal["url"] = rawProposal.externalUrl;


				if (rawProposal["content"] == "" || rawProposal["content"] == null || rawProposal["content"] == undefined) {

					newProposal["raw_summary"] = "No content available.";
					newProposal["summary"] = "No content available.";
					newProposal["was_summarized"] = false;

				} else {

					let sanitizedContent = sanitizeText(rawProposal["content"]).trim();
					if (sanitizedContent.length > 200) newProposal["raw_summary"] = sanitizedContent.slice(0, 200) + "...";
					else newProposal["raw_summary"] = sanitizedContent;

					try {
						newProposal["summary"] = await summarizeProposal(newProposal["raw_summary"]);
						newProposal["was_summarized"] = true;
					} catch (err) {
						newProposal["summary"] = newProposal["raw_summary"];
						newProposal["was_summarized"] = false;
					}
				}

				newProposal["choices"] = rawProposal.choices.map((choice) => sanitizeText(choice).trim());
				newProposal["results"] = rawProposal.indexedResult;

				if (newProposal.title !== undefined) {
					newProposals.push(newProposal);
				}
			}
		});

		await Promise.allSettled(proposalPromises);

		let newProposalIds = new Set();

		newProposals = Array.from(newProposals).filter(({ id }) => {
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
				newProposals.map(
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