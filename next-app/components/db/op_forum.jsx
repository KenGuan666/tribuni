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

export async function fetchLatestOPTopics() {
    const query = `
        SELECT *
        FROM op_forum_topics
        ORDER BY last_posted_at DESC;
    `;
    return await sql.unsafe(query);
}

export async function fetchOPTopicById(topicId) {
    const query = `
        SELECT *
        FROM op_forum_topics
        WHERE id = ${topicId};
    `;
    const topics = await sql.unsafe(query);
    if (topics.length) {
        return topics[0];
    }
    return null;
}

export async function fetchOPPosts() {
    const query = `
        SELECT *
        FROM op_forum_posts;
    `;
    return await sql.unsafe(query);
}

export async function fetchWeeklyPostCount() {
    const query = `
        SELECT count(*)
        FROM op_forum_posts
        WHERE created_at >= NOW() - INTERVAL '7 days';
    `;
    const res = await sql.unsafe(query);
    return res[0].count;
}

export async function fetchWeeklyTrendingTopics() {
    const query = `
        SELECT topic_id, count(*)
        FROM op_forum_posts
        WHERE created_at >= NOW() - INTERVAL '7 days'
        GROUP by topic_id
        ORDER BY count(*) DESC
        LIMIT 3;
    `;
    return await sql.unsafe(query);
}

export async function fetchOPPostsByTopicId(topicId) {
    const query = `
        SELECT *
        FROM op_forum_posts
        WHERE topic_id = ${topicId};
    `;
    return await sql.unsafe(query);
}

export async function fetchOPForumCategories() {
    const query = `
        SELECT *
        FROM op_forum_categories;
    `;
    return await sql.unsafe(query);
}
