"use server";
import { sql } from "./sql";

export async function fetchProtocolById(protocolId) {
    const query = `
        SELECT *
        FROM protocols
        WHERE id = '${protocolId}'
        LIMIT 1;
    `;
    const protocols = await sql.unsafe(query);
    if (protocols.length) {
        return protocols[0];
    }
    return {};
}
