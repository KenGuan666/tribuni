import { createClient } from "@supabase/supabase-js";
import { foraInfo } from "@/constants/foraInfo";
import axios from "axios";
import { htmlToPlaintext } from "@/utils/htmlToPlaintext";
import {
    getPostTags,
    getPostSummary,
    getPostInsights,
    getPostSentiment,
    getPostCommunityFeedback,
    extractDeadline,
    getForumWeeklySummary,
    getForumNumTrendingTopics,
} from "@/components/ai/forum";
import { cookies } from "next/headers";
export async function POST() {
    const _cookies = cookies();
    const db = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
    );

    for (const protocolId of Object.keys(foraInfo)) {
        // uncomment to skip proposals that have been updated in the past week
        // const updatedAtResponse = await db
        //     .from("fora")
        //     .select("updated_at")
        //     .eq("name", protocolId);

        // if (updatedAtResponse.error) {
        //     // deal with this
        // } else {
        //     if (updatedAtResponse.data.length > 0) {
        //         const updatedAt = new Date(
        //             updatedAtResponse.data[0].updated_at,
        //         );
        //         const now = new Date();
        //         const diff = now - updatedAt;
        //         const diffInDays = diff / (1000 * 60 * 60 * 24);
        //         if (diffInDays < 7) {
        //             continue;
        //         }
        //     }
        // }

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

            const postTags = await getPostTags(
                post.raw,
                Object.keys(foraInfo[protocolId].tags),
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
            const deadline = await extractDeadline(post.raw);
            const deadlineDate = new Date(
                `${deadline}/${new Date().getFullYear()}`,
            );

            const progress = (
                ((deadlineDate - now) /
                    (deadlineDate - new Date(post.created_at))) *
                100
            ).toFixed(0);

            const updatedPost = {
                updated_at: new Date(),
                protocolId: protocolId,
                title: post.topic_title,
                tags: postTags,
                postURL: `${foraURL}/t/${post.topic_slug}/${post.topic_id}`,
                numViews: post.reads,
                numComments: post.reply_count,
                numQuotes: post.quote_count,
                summary: postSummary,
                insights: postInsights,
                date: new Date(post.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                }),
                consensusSentimentPercent: consensusPercent,
                consensusSentimentMajority: consensusValue,
                communityFeedback: communityFeedback.filter(
                    (comment) => comment.length > 0,
                ),
                popularVoice:
                    replies.length > 0
                        ? {
                              author: mostPopularReply.username,
                              text: mostPopularReply.text,
                              numViews: mostPopularReply.reads,
                          }
                        : null,
                timeline:
                    deadline !== "none"
                        ? {
                              // format dates as Month/Day (numeric)
                              start: `${new Date(post.created_at).getMonth() + 1}/${new Date(post.created_at).getDate()}`,
                              end: deadline,
                              percentProgress: parseInt(progress),
                              primaryColor: foraInfo[protocolId].primaryColor,
                              secondaryColor:
                                  foraInfo[protocolId].backgroundColor,
                          }
                        : null,
                nativeId: post.id,
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
            primaryColor: foraInfo[protocolId].primaryColor,
            backgroundColor: foraInfo[protocolId].backgroundColor,
            forumURL: foraURL,
            forumIcon: foraInfo[protocolId].icon,
            forumTitle: foraInfo[protocolId].name,
            forumWeeklySummary: forumWeeklySummary,
            forumNumReplies: numReplies,
            forumNumNewPosts: numNewPosts,
            forumNumTrendingTopics: parseInt(forumNumTrendingTopics),
            forumTrendingPosts: relevantPosts
                .sort((a, b) => {
                    const scoreA =
                        (a.numComments + a.numQuotes) / a.numViews || 0;
                    const scoreB =
                        (b.numComments + b.numQuotes) / b.numViews || 0;
                    return scoreB - scoreA;
                })
                .map((post) => post.id)
                .slice(0, 10),
            forumLatestPosts: relevantPosts
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((post) => post.id)
                .slice(0, 10),
            protocolId: protocolId,
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

export async function DELETE() {
    // clear all posts that are older than 7 days

    const db = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
    );

    const { data, error } = await db.from("forum_posts").select("*");
    if (error) {
        // deal with this
    }

    const now = new Date();
    const oldPosts = data.filter((post) => {
        const postDate = new Date(post.created_at);
        const diff = now - postDate;
        const diffInDays = diff / (1000 * 60 * 60 * 24);
        return diffInDays > 7;
    });

    // use "id" field to delete
    const ids = oldPosts.map((post) => post.id);
    const deletionResponse = await db
        .from("forum_posts")
        .delete()
        .in("id", ids);

    if (deletionResponse.error) {
        // deal with this
    }

    // return 201 with 'successfully deleted old posts'
    return new Response("successfully deleted old posts", {
        status: 201,
    });
}
