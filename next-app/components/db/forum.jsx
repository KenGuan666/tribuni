"use server";
import { sql } from "./sql";

// sql provides read access to database
// There's a duplicate definition of tableByProtocolId in the write database library: @/components/db/supabase
var tableByProtocolId = {
    optimism: ["op_forum_topics", "op_forum_posts", "op_forum_categories"],
    compound: [
        "comp_forum_topics",
        "comp_forum_posts",
        "comp_forum_categories",
    ],
};

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

export async function fetchExistingTopics(protocolId) {
    let [topicTableName, postTableName, categoryTableName] =
        tableByProtocolId[protocolId];
    const query = `
        SELECT *
        FROM ${topicTableName};
    `;
    return await sql.unsafe(query);
}

export async function fetchExistingTopicsCount(protocolId) {
    let [topicTableName, postTableName, categoryTableName] =
        tableByProtocolId[protocolId];
    const query = `
        SELECT count(*)
        FROM ${topicTableName};
    `;
    const res = await sql.unsafe(query);
    return res[0].count;
}

export async function fetchWeeklyNewTopics(protocolId) {
    let [topicTableName, postTableName, categoryTableName] =
        tableByProtocolId[protocolId];
    const query = `
        SELECT title
        FROM ${topicTableName}
        WHERE created_at >= NOW() - INTERVAL '7 days';
    `;
    return await sql.unsafe(query);
}

export async function fetchLatestTopics(protocolId) {
    let [topicTableName, postTableName, categoryTableName] =
        tableByProtocolId[protocolId];
    const query = `
        SELECT *
        FROM ${topicTableName}
        ORDER BY last_posted_at DESC;
    `;
    return await sql.unsafe(query);
}

export async function fetchTopicById(protocolId, topicId) {
    let [topicTableName, postTableName, categoryTableName] =
        tableByProtocolId[protocolId];
    const query = `
        SELECT *
        FROM ${topicTableName}
        WHERE id = ${topicId};
    `;
    const topics = await sql.unsafe(query);
    if (topics.length) {
        return topics[0];
    }
    return null;
}

export async function fetchPosts(protocolId) {
    let [topicTableName, postTableName, categoryTableName] =
        tableByProtocolId[protocolId];
    const query = `
        SELECT *
        FROM ${postTableName};
    `;
    return await sql.unsafe(query);
}

export async function fetchWeeklyPostCount(protocolId) {
    let [topicTableName, postTableName, categoryTableName] =
        tableByProtocolId[protocolId];
    const query = `
        SELECT count(*)
        FROM ${postTableName}
        WHERE created_at >= NOW() - INTERVAL '7 days';
    `;
    const res = await sql.unsafe(query);
    return res[0].count;
}

export async function fetchPostCount(protocolId) {
    let [topicTableName, postTableName, categoryTableName] =
        tableByProtocolId[protocolId];
    const query = `
        SELECT count(*)
        FROM ${postTableName};
    `;
    const res = await sql.unsafe(query);
    return res[0].count;
}

export async function fetchWeeklyTrendingTopics(protocolId) {
    let [topicTableName, postTableName, categoryTableName] =
        tableByProtocolId[protocolId];
    const query = `
        SELECT topic_id, count(*)
        FROM ${postTableName}
        WHERE created_at >= NOW() - INTERVAL '7 days'
        GROUP by topic_id
        ORDER BY count(*) DESC
        LIMIT 3;
    `;
    return await sql.unsafe(query);
}

export async function fetchPostsByTopicId(protocolId, topicId) {
    let [topicTableName, postTableName, categoryTableName] =
        tableByProtocolId[protocolId];
    const query = `
        SELECT *
        FROM ${postTableName}
        WHERE topic_id = ${topicId};
    `;
    return await sql.unsafe(query);
}

export async function fetchForumCategories(protocolId) {
    let [topicTableName, postTableName, categoryTableName] =
        tableByProtocolId[protocolId];
    const query = `
        SELECT *
        FROM ${categoryTableName};
    `;
    return await sql.unsafe(query);
}
