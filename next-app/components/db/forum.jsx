"use server";
import { sql } from "./sql";

export async function fetchFora() {
    const query = `
        SELECT *
        FROM fora;
    `;
    return await sql.unsafe(query);
}

export async function fetchForumById(forumId) {
    const query = `
        SELECT *
        FROM fora
        WHERE id = ${forumId}
        LIMIT 1;
    `;
    const fora = await sql.unsafe(query);
    if (fora.length) {
        return fora[0];
    }
    return {};
}

export async function fetchForumByProtocol(protocolId) {
    const query = `
        SELECT *
        FROM fora
        WHERE protocol_id = '${protocolId}'
        LIMIT 1;
    `;
    const fora = await sql.unsafe(query);
    if (fora.length) {
        return fora[0];
    }
    return {};
}
