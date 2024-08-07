"use server";
import { timestampNow } from "@/utils/time";
import { sql } from "./sql";

export async function fetchExistingTopics() {
    const query = `
        SELECT *
        FROM op_forum_topics;
    `;
    return await sql.unsafe(query);
}

export async function fetchWeeklyNewTopics() {
    const query = `
        SELECT title
        FROM op_forum_topics
        WHERE created_at >= NOW() - INTERVAL '7 days';
    `;
    return await sql.unsafe(query);
}
