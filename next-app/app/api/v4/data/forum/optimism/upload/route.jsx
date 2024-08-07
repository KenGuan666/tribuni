import { fetchExistingTopics } from "@/components/db/op_forum";
import {
    getCategory,
    getTopicPostsFromDiscourse,
    getTopicsFromDiscourse,
} from "./discourse";
import {
    getSupabase,
    updateOpForumWeeklySummary,
    upsertOPForumCategories,
    upsertOpForumPosts,
    upsertOpForumTopics,
} from "@/components/db/supabase";
import { fetchForumById } from "@/components/db/forum";
import {
    fetchOPForumCategories,
    fetchOPPostsByTopicId,
    fetchWeeklyNewTopics,
} from "@/components/db/op_forum";
import {
    getPostSummary,
    getPostInsights,
    getPostSentiment,
    getPostCommunityFeedback,
    getForumWeeklySummary,
} from "@/components/ai/forum";
import { isLessThanNDaysAgo } from "@/utils/time";

const baseURL = "https://gov.optimism.io";

/*
    /api/v4/data/forum/upload responsible for:
    - Update each existing topic that has had a new post or like in past 14 days
    - Fetch new topics
*/
export async function POST(req) {
    const existingTopics = await fetchExistingTopics();
    const existingTopicsById = existingTopics.reduce((m, topic) => {
        m[topic.id] = topic;
        return m;
    }, {});
    const existingIds = new Set(existingTopics.map((t) => t.id));

    const topicsRes = await getTopicsFromDiscourse();
    const topics = topicsRes.topic_list.topics;
    const newTopics = topics.filter((topic) => !existingIds.has(topic.id));

    const categories = await fetchOPForumCategories();
    const categoriesById = categories.reduce((m, c) => {
        m[c.id] = c;
        return m;
    }, {});
    const supabase = getSupabase();
    // Start by getting existing topics
    // All AI-heavy work are done sequentially to avoid hitting OpenAI rate limit

    // TODO: refactor and reuse
    for (const topic of newTopics) {
        let newPostDbObjects = [];
        const topicPostsRes = await getTopicPostsFromDiscourse(topic.id);
        const topicPosts = topicPostsRes.post_stream.posts;
        const firstPost = topicPosts[0];
        const replies = topicPosts.slice(1);
        const repliesHTML = replies.map((r) => r.cooked);
        newPostDbObjects.push({
            id: firstPost.id,
            topic_id: topic.id,
            post_number: 1,
            created_at: firstPost.created_at,
            author_username:
                firstPost.display_username ||
                firstPost.name ||
                firstPost.username,
            author_avatar: avatarFromTemplate(firstPost.avatar_template),
            url: url(topic, 1),
        });

        const summary = await getPostSummary(firstPost.cooked);
        await sleep(2.5);
        const insight = await getPostInsights(firstPost.cooked, summary);

        let topicDb = {
            id: topic.id,
            category_id: topic.category_id,
            created_at: topic.created_at,
            last_posted_at: topic.last_posted_at,
            updated_at: new Date().toISOString(),
            title: topic.title,
            post_count: topic.posts_count,
            like_count: topic.like_count,
            author_username:
                firstPost.display_username ||
                firstPost.name ||
                firstPost.username,
            summary,
            insight,
            author_avatar: avatarFromTemplate(firstPost.avatar_template),
            first_post_url: `${baseURL}/t/${topic.slug}/${topic.id}/1`,
        };
        if (replies.length > 0) {
            await sleep(2.5);
            const feedbackSummary = await getPostCommunityFeedback(
                firstPost.cooked,
                repliesHTML,
            );
            topicDb.community_summary = feedbackSummary;
            for (const r of replies) {
                await sleep(2.5);
                const sentiment = await getPostSentiment(summary, r.cooked);
                newPostDbObjects.push({
                    id: r.id,
                    topic_id: topic.id,
                    post_number: r.post_number,
                    created_at: r.created_at,
                    author_username: r.display_username || r.name || r.username,
                    author_avatar: avatarFromTemplate(r.avatar_template),
                    url: url(topic, r.post_number),
                    is_sentiment_positive: sentiment,
                    content: r.cooked,
                });
            }
        }
        await upsertOpForumPosts(supabase, newPostDbObjects);
        await upsertOpForumTopics(supabase, [topicDb]);
        console.log(`Uploaded new topic ${topic.id}: ${topic.title}`);

        if (!categoriesById.topic.category_id) {
            const category = getCategory(categoriesById.topic.category_id);
            await upsertOPForumCategories([category]);
            console.log(`Uploaded new category ${category.name}`);
        }
    }

    // Next, update all topics created within 30 days
    const recentTopics = topics.filter((topic) => existingIds.has(topic.id));
    for (const topic of recentTopics) {
        const existingTopic = existingTopicsById[topic.id];
        let hasUpdated = false;
        let newCommunitySummary = null;
        if (existingTopic.like_count != topic.like_count) {
            hasUpdated = true;
        }

        // There's a small chance that posts db is not sync'ed with post_count
        const existingPosts = await fetchOPPostsByTopicId(topic.id);
        const existingPostCount = existingPosts.length;
        // if there are new posts, save and run sentiment analysis on them
        if (existingPostCount != topic.posts_count) {
            hasUpdated = true;
            const topicPostsRes = await getTopicPostsFromDiscourse(topic.id);
            const topicPosts = topicPostsRes.post_stream.posts;
            newCommunitySummary = await getPostCommunityFeedback(
                existingTopic.summary,
                topicPosts.map((p) => p.cooked),
            );

            const existingPostNumbers = new Set(
                existingPosts.map((p) => p.post_number),
            );
            const newReplies = topicPosts.filter(
                (p) => !existingPostNumbers.has(p.post_number),
            );
            let newPostDbObjects = [];
            for (const r of newReplies) {
                await sleep(2.5);
                const sentiment = await getPostSentiment(
                    existingTopic.summary,
                    r.cooked,
                );
                newPostDbObjects.push({
                    id: r.id,
                    topic_id: topic.id,
                    post_number: r.post_number,
                    created_at: r.created_at,
                    author_username: r.display_username || r.name || r.username,
                    author_avatar: avatarFromTemplate(r.avatar_template),
                    url: url(topic, r.post_number),
                    is_sentiment_positive: sentiment,
                    content: r.cooked,
                });
            }
            await upsertOpForumPosts(supabase, newPostDbObjects);
        }
        if (hasUpdated) {
            const newTopicDb = {
                id: topic.id,
                category_id: topic.category_id,
                created_at: topic.created_at,
                last_posted_at: topic.last_posted_at,
                updated_at: new Date().toISOString(),
                title: topic.title,
                post_count: topic.posts_count,
                like_count: topic.like_count,
                author_username: existingTopic.author_username,
                author_avatar: existingTopic.author_avatar,
                summary: existingTopic.summary,
                insight: existingTopic.insight,
                community_summary:
                    newCommunitySummary || existingTopic.community_summary,
                first_post_url: existingTopic.first_post_url,
            };
            await upsertOpForumTopics(supabase, [newTopicDb]);
            console.log(`Updated topic ${topic.id}: 
                ${existingPostCount} -> ${topic.posts_count} posts, 
                ${existingTopic.like_count} -> ${topic.like_count} likes`);
        }
    }

    // TODO: Implement a cost-effective strategy to update topics older than 30 days

    // Finally, create a 1-sentence weekly summary
    const forum = await fetchForumById(1);
    if (!isLessThanNDaysAgo(forum.updated_at, 1)) {
        const weeklyTitles = await fetchWeeklyNewTopics();
        const weeklySummary = await getForumWeeklySummary(
            weeklyTitles.map((r) => r.title),
        );
        await updateOpForumWeeklySummary(supabase, weeklySummary);
        console.log(`Updated weekly summary: ${weeklySummary}`);
    }
    return Response.json({ message: "success" }, { status: 201 });
}

function avatarFromTemplate(template) {
    const prefix = template[0] === "/" ? baseURL : "";
    return `${prefix}${template.replace("{size}", 64)}`;
}

function url(topic, postNumber) {
    return `${baseURL}/t/${topic.slug}/${topic.id}/${postNumber}`;
}

function sleep(s) {
    return new Promise((resolve) => setTimeout(resolve, s * 1000));
}
