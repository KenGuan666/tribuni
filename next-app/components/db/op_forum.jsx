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
