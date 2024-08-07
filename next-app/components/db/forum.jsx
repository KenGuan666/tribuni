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

export async function fetchActivePostsByForumId(forumId) {
    const activeCriteria =
        "updated_at >= CURRENT_TIMESTAMP - INTERVAL '14 days'";
    const query = `
        SELECT *
        FROM forum_posts
        WHERE forum_id = ${forumId}
        AND ${activeCriteria};
    `;
    return await sql.unsafe(query);
}
