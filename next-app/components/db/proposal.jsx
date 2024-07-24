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

export async function fetchProposalsByIds(proposalIds) {
    if (!proposalIds.length) {
        return [];
    }
    const query = `
        SELECT *
        FROM proposals
        WHERE id = ANY($1);
    `;
    return await sql.unsafe(query, [proposalIds]);
}

export async function fetchProposalByProtocolId(protocolId) {
    const query = `
        SELECT *
        FROM proposals
        WHERE protocol = '${protocolId}';
    `;
    return await sql.unsafe(query);
}

export async function fetchProposalCountByProtocols(protocolIds) {
    const query = `
        SELECT protocol, COUNT(*) AS count
        FROM proposals
        WHERE protocol = ANY($1)
        GROUP BY protocol;
    `;
    return await sql.unsafe(query, [protocolIds]);
}
