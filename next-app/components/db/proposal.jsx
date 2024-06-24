"use server";
import { sql } from "./sql";

export async function fetchProposalData(proposalId) {
    const proposalQuery = `
        SELECT *
        FROM proposals
        WHERE id = '${proposalId}'
        LIMIT 1;
    `;
    const proposals = await sql.unsafe(proposalQuery);
    if (proposals.length) {
        return proposals[0];
    }
    return {};
}
