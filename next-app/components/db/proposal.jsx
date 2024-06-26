"use server";
import { sql } from "./sql";

export async function fetchProposalById(proposalId) {
    const query = `
        SELECT *
        FROM proposals
        WHERE id = '${proposalId}'
        LIMIT 1;
    `;
    const proposals = await sql.unsafe(query);
    if (proposals.length) {
        return proposals[0];
    }
    return {};
}

export async function fetchProposalByProtocolId(protocolId) {
    const query = `
        SELECT *
        FROM proposals
        WHERE protocol = '${protocolId}';
    `;
    return await sql.unsafe(query);
}
