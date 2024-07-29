import { foraInfo } from "@/constants/foraInfo";
import { getSupabase } from "@/components/db/supabase";
import axios from "axios";
import { htmlToPlaintext } from "@/utils/htmlToPlaintext";
import {
    getPostSummary,
    getPostInsights,
    getPostSentiment,
    getPostCommunityFeedback,
    getForumWeeklySummary,
    getForumNumTrendingTopics,
} from "@/components/ai/forum";
import { cookies } from "next/headers";

/*
    /api/v4/data/forum/upload is responsible for 2 tasks:
    1. For each tracked forum, fetch new forum posts, and generate summaries and analysis for each
    2. For each tracked forum, update existing active posts, and regenerate analysis if applicable
*/
export async function POST() {
    const _cookies = cookies();
    const db = getSupabase();

    for (const protocolId of Object.keys(foraInfo)) {
        const foraURL = foraInfo[protocolId].url;
        const protocolInfoResponse = await db
            .from("protocols")
            .select("*")
            .eq("id", protocolId);
        if (protocolInfoResponse.error) {
            // deal with this
        }
        const protocolInfo = protocolInfoResponse.data[0];

        const latestPostsResponse = await axios.get(
            `${foraURL}/posts.json?Api-Key=${process.env.DISCOURSE_API_KEY}&Api-Username=${process.env.DISCOURSE_API_USERNAME}`,
        );
        const latestPosts = latestPostsResponse.data.latest_posts;
        // filter out posts whose created_at field is older than 7 days
        const now = new Date();
        const thisWeekPosts = latestPosts.filter((post) => {
            const postDate = new Date(post.created_at);
            const diff = now - postDate;
            const diffInDays = diff / (1000 * 60 * 60 * 24);
            return diffInDays < 7;
        });

        let postsToFetch = [];
        let insertedPosts = [];
        for (let i = 0; i < thisWeekPosts.length; i++) {
            const post = thisWeekPosts[i];
            console.log(`fetching post ${i + 1} of ${thisWeekPosts.length}`);
            // check if post already exists in db
            const currentPostResponse = await db
                .from("forum_posts")
                .select("*")
                .eq("nativeId", post.id)
                .eq("protocolId", protocolId);

            if (currentPostResponse.error) {
                // deal with this
            } else {
                if (currentPostResponse.data.length !== 0) {
                    console.log(`post ${i + 1} already exists in db`);
                    for (const existingPost of currentPostResponse.data)
                        postsToFetch.push(existingPost.id);
                    continue;
                }
            }

            const repliesResponse = await axios.get(
                `${foraURL}/posts/${post.id}/replies.json?Api-Key=${process.env.DISCOURSE_API_KEY}&Api-Username=${process.env.DISCOURSE_API_USERNAME}`,
            );
            const replies = repliesResponse.data.map((reply) => {
                const text = htmlToPlaintext(reply.cooked); // clean text and remove unused fields
                return {
                    username: reply.username,
                    text,
                    reads: reply.reads,
                    reply_count: reply.reply_count,
                    quote_count: reply.quote_count,
                };
            });
            // most popular reply has highest sum of (reply_count + quote_count) / reads or first if all are zero
            const mostPopularReply = replies.reduce(
                (acc, reply) => {
                    const score =
                        (reply.reply_count + reply.quote_count) / reply.reads;
                    if (score > acc.score) {
                        return { score, reply };
                    } else return acc;
                },
                { score: 0, reply: replies[0] },
            );

            await new Promise((r) => setTimeout(r, 2000));
            const postSummary = await getPostSummary(post.raw);
            await new Promise((r) => setTimeout(r, 2000));
            const postInsights = await getPostInsights(post.raw, postSummary);
            await new Promise((r) => setTimeout(r, 2000));
            const { consensusPercent, consensusValue } =
                replies.length > 0
                    ? await getPostSentiment(
                          post.raw,
                          replies.map((reply) => reply.text),
                      )
                    : { consensusPercent: null, consensusValue: null };
            await new Promise((r) => setTimeout(r, 2000));
            const communityFeedback =
                replies.length > 0
                    ? await getPostCommunityFeedback(
                          post.raw,
                          replies.map((reply) => reply.text),
                      )
                    : [];
            await new Promise((r) => setTimeout(r, 2000));

            const updatedPost = {
                updated_at: new Date(),
                protocol_id: protocolId,
                title: post.topic_title,
                // TODO: for OP forum, extract "category" from Discourse API as tag
                tags: [],
                post_url: `${foraURL}/t/${post.topic_slug}/${post.topic_id}`,
                num_views: post.reads,
                num_comments: post.reply_count,
                num_quotes: post.quote_count,
                summary: postSummary,
                insights: postInsights,
                date: new Date(post.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                }),
                consensus_sentiment_percent: consensusPercent,
                consensus_sentiment_majority: consensusValue,
                community_feedback: communityFeedback.filter(
                    (comment) => comment.length > 0,
                ),
                popular_voice:
                    replies.length > 0
                        ? {
                              author: mostPopularReply.username,
                              text: mostPopularReply.text,
                              numViews: mostPopularReply.reads,
                          }
                        : null,
                native_id: post.id,
            };
            const postInsertionResponse = await db
                .from("forum_posts")
                .upsert([updatedPost])
                .select();
            if (postInsertionResponse.error) {
                // deal with this
            }
            insertedPosts.push(postInsertionResponse.data[0]);
        }

        let relevantPosts = [];
        for (const post of insertedPosts) relevantPosts.push(post);

        const existingPostsResponse = await db
            .from("forum_posts")
            .select("*")
            .in("id", postsToFetch);

        if (existingPostsResponse.error) {
            // deal with this
        }

        for (const post of existingPostsResponse.data) relevantPosts.push(post);

        const numReplies = relevantPosts.reduce(
            (acc, post) => acc + post.numComments,
            0,
        );
        const numNewPosts = relevantPosts.length;

        const forumWeeklySummary = await getForumWeeklySummary(
            relevantPosts.map((post) => post.summary),
        );
        await new Promise((r) => setTimeout(r, 2000));
        const forumNumTrendingTopics = await getForumNumTrendingTopics(
            relevantPosts.map((post) => post.summary),
        );

        const updatedForum = {
            updated_at: new Date(),
            name: protocolInfo.name,
            icon: protocolInfo.icon,
            primary_color: foraInfo[protocolId].primary_color,
            background_color: foraInfo[protocolId].background_color,
            forum_url: foraURL,
            forum_icon: foraInfo[protocolId].icon,
            forum_title: foraInfo[protocolId].name,
            forum_weekly_summary: forumWeeklySummary,
            forum_num_replies: numReplies,
            forum_num_new_posts: numNewPosts,
            forum_num_trending_topics: parseInt(forumNumTrendingTopics),
            protocol_id: protocolId,
        };

        const forumInsertionResponse = await db
            .from("fora")
            .upsert([updatedForum])
            .select();

        if (forumInsertionResponse.error) {
            // deal with this
        } else
            console.log(
                "successfully updated forum for",
                protocolId,
                "with id",
                forumInsertionResponse.data[0].id,
            );
    }

    // return 201 with 'successfully fetched protocol fora'
    return new Response("successfully populated protocol fora", {
        status: 201,
    });
}
