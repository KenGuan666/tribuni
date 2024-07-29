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

export async function fetchLatestPostsByForumId(forumId) {
    const query = `
        SELECT *
        FROM forum_posts
        WHERE forum_id = ${forumId}
        ORDER BY date DESC;
    `;
    return await sql.unsafe(query);
}

// Note: definition to "trending" is subject to change
export async function fetchTrendingPostsByForumId(forumId) {
    const trendingCriteria = "num_comments * 50 + num_views";
    const query = `
        SELECT *
        FROM forum_posts
        WHERE forum_id = ${forumId}
        ORDER BY ${trendingCriteria} DESC;
    `;
    return await sql.unsafe(query);
}

export async function fetchForumPostById(postId) {
    const query = `
        SELECT *
        FROM forum_posts
        WHERE id = ${postId}
        LIMIT 1;
    `;
    const posts = await sql.unsafe(query);
    if (posts.length) {
        return posts[0];
    }
    return {};
}

export async function fetchForumPostsByIds(postIds) {
    if (!postIds.length) {
        return [];
    }
    const query = `
        SELECT *
        FROM forum_posts
        WHERE id = ANY($1);
    `;
    return await sql.unsafe(query, [postIds]);
}
