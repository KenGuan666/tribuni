import { fetchAllUsersData } from "@/components/db/user";
import {
    fetchForumByProtocol,
    fetchPostsByTopicId,
    fetchTopicById,
    fetchWeeklyTrendingTopics,
} from "@/components/db/forum";
import { getBot } from "@/components/bot";
import { knownForums } from "@/app/api/v4/data/forum/[protocolId]/upload/route";
import { calculateSentimentScore } from "@/app/forum/[protocolId]/[topicId]/Sentiment";
import { dropLastSentence, sanitizeAIListOutput } from "@/utils/text";

export async function GET(req) {
    return await POST(req);
}

/*
    /api/v4/alerts/forum/[protocolId]: this endpoints sends forum weekly digest to subscribed users
*/
export async function POST(req) {
    const protocolId = req.nextUrl.pathname.split("/")[5];
    if (!knownForums.has(protocolId)) {
        return Response.json(
            { message: `unsupported protocol ${protocolId}` },
            { status: 400 },
        );
    }
    const bot = getBot();

    const forum = await fetchForumByProtocol(protocolId);
    // generate the weekly forum digest
    const markdownMessage = await alertContent(protocolId, forum);

    // get the list of subscribers
    const users = await fetchAllUsersData();
    const opSubscribers = users.filter((u) =>
        u.subscriptions.includes(protocolId),
    );

    await Promise.all(
        opSubscribers.map((user) => {
            const alertButtons = [
                [
                    {
                        text: `Explore AI-organized ${forum.name} on Tribuni`,
                        web_app: {
                            url: `${process.env.SERVER_URL}/forum/${protocolId}?username=${user.id}&chatid=${user.chatid}`,
                        },
                    },
                ],
                [
                    {
                        text: `Go to ${forum.name} forum`,
                        url: forum.forum_url,
                    },
                ],
            ];
            const telegramMessageOptions = {
                parse_mode: "Markdown",
                reply_markup: {
                    inline_keyboard: alertButtons,
                },
            };
            return bot.sendMessage(
                user.chatid,
                markdownMessage,
                telegramMessageOptions,
            );
        }),
    );

    return Response.json(
        {
            message: "Successfully sent telegram alerts",
        },
        { status: 201 },
    );
}

async function alertContent(protocolId, forum) {
    let message = `💼 *${forum.name} Forum Weekly Summary*\n`;

    const weeklySummary = forum.forum_weekly_summary;
    message += weeklySummary;
    message += " Top topics are summarized below.\n\n"

    const weeklyTrendingTopicIds = await fetchWeeklyTrendingTopics(protocolId);
    const weeklyTrendingTopics = await Promise.all(
        weeklyTrendingTopicIds.map(
            async (id) => await fetchTopicById(protocolId, id.topic_id),
        ),
    );
    const sentimentScoreByTopicId = new Map(
        await Promise.all(
            weeklyTrendingTopics.map(async (topic) => {
                topic.posts = await fetchPostsByTopicId(protocolId, topic.id);
                const sentimentScore = calculateSentimentScore(topic);
                return [topic.id, sentimentScore];
            })
        )
    );
    weeklyTrendingTopics.forEach((t, index) => {
        message += `*${index + 1}. *[${t.title}](${t.first_post_url}) *by ${t.author_username}*\n`;
        message += `${dropLastSentence(t.summary)}\n\n`;

        const communityFeedback = sanitizeAIListOutput(t.community_summary);
        message += `*${sentimentScoreByTopicId.get(t.id)}%* of the ${t.post_count - 1} replies expressed positive sentiment.\n`;
        message += `${communityFeedback.map((str) => `- ${str}`).join("\n")}\n`;
    });

    message += `\nClick *Explore AI-organized ${forum.name} on Tribuni* below to see more summaried posts and community feedback!`;

    return message;
}
