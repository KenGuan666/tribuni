import {
    getCategory,
    getTopicPostsFromDiscourse,
    getTopicsFromDiscourse,
    forumAvatarFromTemplate,
    postUrl,
} from "../../discourse";
import {
    getSupabase,
    updateForumWeeklySummary,
    upsertForumCategories,
    upsertForumPosts,
    upsertForumTopics,
} from "@/components/db/supabase";
import { fetchForumById } from "@/components/db/forum";
import {
    fetchExistingTopics,
    fetchForumCategories,
    fetchPostsByTopicId,
    fetchWeeklyNewTopics,
} from "@/components/db/forum";
import {
    getPostSummary,
    getPostInsights,
    getPostSentiment,
    getPostCommunityFeedback,
    getForumWeeklySummary,
} from "@/components/ai/forum";
import { isLessThanNDaysAgo } from "@/utils/time";

export const maxDuration = 300;
var knownForums = new Set(["optimism", "compound"]);

export async function GET(req) {
    return await POST(req);
}

/*
    /api/v4/data/forum/[protocolId]/upload responsible for:
    - Update each existing topic that has had a new post or like in past 14 days
    - Fetch new topics
*/
export async function POST(req) {
    const protocolId = req.nextUrl.pathname.split("/")[5];
    if (!knownForums.has(protocolId)) {
        return Response.json(
            { message: `unsupported protocol ${protocolId}` },
            { status: 400 },
        );
    }

    const existingTopics = await fetchExistingTopics(protocolId);
    const existingTopicsById = existingTopics.reduce((m, topic) => {
        m[topic.id] = topic;
        return m;
    }, {});
    const existingIds = new Set(existingTopics.map((t) => t.id));

    const topicsRes = await getTopicsFromDiscourse(protocolId);
    const topics = topicsRes.topic_list.topics;
    const newTopics = topics.filter((topic) => !existingIds.has(topic.id));

    const categories = await fetchForumCategories(protocolId);
    const categoriesById = categories.reduce((m, c) => {
        m[c.id] = c;
        return m;
    }, {});
    const supabase = getSupabase();

    // Start by summarizing new topics
    // All AI-heavy work are done sequentially to avoid hitting OpenAI rate limit
    // TODO: refactor and reuse
    for (const topic of newTopics) {
        let newPostDbObjects = [];
        const topicPostsRes = await getTopicPostsFromDiscourse(
            protocolId,
            topic.id,
        );
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
            author_avatar: forumAvatarFromTemplate(
                protocolId,
                firstPost.avatar_template,
            ),
            url: postUrl(protocolId, topic, 1),
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
            author_avatar: forumAvatarFromTemplate(
                protocolId,
                firstPost.avatar_template,
            ),
            first_post_url: postUrl(protocolId, topic, 1),
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
                    author_avatar: forumAvatarFromTemplate(
                        protocolId,
                        r.avatar_template,
                    ),
                    url: postUrl(protocolId, topic, r.post_number),
                    is_sentiment_positive: sentiment,
                    content: r.cooked,
                });
            }
        }
        let err = await upsertForumTopics(supabase, protocolId, [topicDb]);
        if (err) {
            console.log(err);
        }
        console.log(`Uploaded new topic ${topic.id}: ${topic.title}`);
        err = await upsertForumPosts(supabase, protocolId, newPostDbObjects);
        if (err) {
            console.log(err);
        }
        console.log(
            `Uploaded ${newPostDbObjects.length} posts of new topic ${topic.id}`,
        );
        console.log(newPostDbObjects);

        if (!categoriesById[topic.category_id]) {
            const category = await getCategory(protocolId, topic.category_id);
            await upsertForumCategories(supabase, protocolId, [category]);
            console.log(`Uploaded new category ${category.name}`);
        }
    }

    // Next, update all topics created within 30 days
    const recentTopics = topics.filter((topic) => existingIds.has(topic.id));
    for (const topic of recentTopics) {
        const existingTopic = existingTopicsById[topic.id];
        let hasUpdated = false;
        let communitySummary = existingTopic.community_summary;
        if (existingTopic.like_count != topic.like_count) {
            hasUpdated = true;
        }

        // There's a small chance that posts db is not sync'ed with post_count
        const existingPosts = await fetchPostsByTopicId(protocolId, topic.id);
        const existingPostCount = existingPosts.reduce(
            (c, p) => (p.post_number > c ? p.post_number : c),
            0,
        );
        let last_posted_at = topic.last_posted_at;
        // only update if there are new posts
        // if there are new posts, save and run sentiment analysis on them
        // TODO: handle post deletion better
        if (existingPostCount < topic.posts_count) {
            hasUpdated = true;
            const topicPostsRes = await getTopicPostsFromDiscourse(
                protocolId,
                topic.id,
            );
            const topicPosts = topicPostsRes.post_stream.posts;
            communitySummary = await getPostCommunityFeedback(
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
                    author_avatar: forumAvatarFromTemplate(
                        protocolId,
                        r.avatar_template,
                    ),
                    url: postUrl(protocolId, topic, r.post_number),
                    is_sentiment_positive: sentiment,
                    content: r.cooked,
                });
                last_posted_at =
                    last_posted_at > r.created_at
                        ? last_posted_at
                        : r.created_at;
            }
            let err = await upsertForumPosts(
                supabase,
                protocolId,
                newPostDbObjects,
            );
            if (err) {
                console.log(err);
            }
        }
        if (hasUpdated) {
            const newTopicDb = {
                id: topic.id,
                category_id: topic.category_id,
                created_at: topic.created_at,
                last_posted_at,
                updated_at: new Date().toISOString(),
                title: topic.title,
                post_count: topic.posts_count,
                like_count: topic.like_count,
                author_username: existingTopic.author_username,
                author_avatar: existingTopic.author_avatar,
                summary: existingTopic.summary,
                insight: existingTopic.insight,
                community_summary: communitySummary,
                first_post_url: existingTopic.first_post_url,
            };
            let err = await upsertForumTopics(supabase, protocolId, [
                newTopicDb,
            ]);
            if (err) {
                console.log(err);
            }
            console.log(`Updated topic ${topic.id}: 
                ${existingPostCount} -> ${topic.posts_count} posts, 
                ${existingTopic.like_count} -> ${topic.like_count} likes`);
        }
    }

    // TODO: Implement a cost-effective strategy to update topics older than 30 days
    const processedTopicsId = new Set(topics.map((t) => t.id));
    const olderTopicsToUpdate = existingTopics.filter(
        (t) =>
            !processedTopicsId.has(t.id) &&
            isLessThanNDaysAgo(t.updated_at, 14),
    );
    for (const topic of olderTopicsToUpdate) {
        const topicPostsRes = await getTopicPostsFromDiscourse(
            protocolId,
            topic.id,
        );
        const topicPosts = topicPostsRes.post_stream.posts;
        const existingPosts = await fetchPostsByTopicId(protocolId, topic.id);
        const existingPostNumbers = new Set(
            existingPosts.map((p) => p.post_number),
        );
        // only update if there are new posts
        // TODO: handle post deletion better
        const newPosts = topicPosts.filter(
            (t) => !existingPostNumbers.has(t.post_number),
        );
        let lastPostAt = topic.last_posted_at;
        let communitySummary = topic.community_summary;
        if (newPosts.length) {
            communitySummary = await getPostCommunityFeedback(
                topic.summary,
                topicPosts.map((p) => p.cooked),
            );
            let newPostDbObjects = [];
            for (const r of newPosts) {
                const sentiment = await getPostSentiment(
                    topic.summary,
                    r.cooked,
                );
                newPostDbObjects.push({
                    id: r.id,
                    topic_id: topic.id,
                    post_number: r.post_number,
                    created_at: r.created_at,
                    author_username: r.display_username || r.name || r.username,
                    author_avatar: forumAvatarFromTemplate(
                        protocolId,
                        r.avatar_template,
                    ),
                    url: postUrl(protocolId, topic, r.post_number),
                    is_sentiment_positive: sentiment,
                    content: r.cooked,
                });
                lastPostAt =
                    lastPostAt > r.created_at ? lastPostAt : r.created_at;
            }
            let err = await upsertForumPosts(
                supabase,
                protocolId,
                newPostDbObjects,
            );
            if (err) {
                console.log(err);
            }
            err = await upsertForumTopics(supabase, protocolId, [
                {
                    id: topic.id,
                    category_id: topicPostsRes.category_id,
                    created_at: topic.created_at,
                    last_posted_at: lastPostAt,
                    updated_at: new Date().toISOString(),
                    title: topicPostsRes.title,
                    post_count: topicPostsRes.posts_count,
                    like_count: topicPostsRes.like_count,
                    author_username: topic.author_username,
                    author_avatar: topic.author_avatar,
                    summary: topic.summary,
                    insight: topic.insight,
                    community_summary: communitySummary,
                    first_post_url: topic.first_post_url,
                },
            ]);
            if (err) {
                console.log(err);
            }
            console.log(`Updated old topic ${topic.id}:
                ${existingPosts.length} -> ${topicPostsRes.posts_count} posts,
                ${topic.like_count} -> ${topicPostsRes.like_count} likes`);
        }
    }

    // Finally, create a 1-sentence weekly summary
    const forum = await fetchForumById(1);
    if (!isLessThanNDaysAgo(forum.updated_at, 1)) {
        const weeklyTitles = await fetchWeeklyNewTopics(protocolId);
        const weeklySummary = await getForumWeeklySummary(
            weeklyTitles.map((r) => r.title),
        );
        await updateForumWeeklySummary(supabase, protocolId, weeklySummary);
        console.log(`Updated weekly summary: ${weeklySummary}`);
    }
    return Response.json({ message: "success" }, { status: 201 });
}

function sleep(s) {
    return new Promise((resolve) => setTimeout(resolve, s * 1000));
}
