import { fetchAllUsersData } from "@/components/db/user";
import { fetchForumById } from "@/components/db/forum";
import {
    fetchOPTopicById,
    fetchWeeklyTrendingTopics,
} from "@/components/db/op_forum";
import { getBot } from "@/components/bot";
import { dropLastSentence, sanitizeAIListOutput } from "@/utils/text";

export async function GET() {
    return await POST();
}

/*
    POST: this endpoints sends OP forum weekly digests to users when called
*/
export async function POST() {
    const bot = getBot();

    // generate the weekly OP forum digest
    const markdownMessage = await alertContent();

    // get the list of OP subscribers
    const users = await fetchAllUsersData();
    const opSubscribers = users.filter((u) =>
        u.subscriptions.includes("optimism"),
    );

    await Promise.all(
        opSubscribers.map((user) => {
            const alertButtons = [
                [
                    {
                        text: "More Forum Summaries on Tribuni",
                        web_app: {
                            url: `${process.env.SERVER_URL}/forum/optimism?username=${user.id}&chatid=${user.chatid}`,
                        },
                    },
                ],
                [
                    {
                        text: "Go to Native Forum",
                        url: "https://gov.optimism.io",
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

async function alertContent() {
    let message = `💼 *OP Forum Weekly Summary*\n`;

    const opForum = await fetchForumById(1);
    const weeklySummary = opForum.forum_weekly_summary;
    message += weeklySummary;

    message += `\n\n*Top Topics*:`;
    const weeklyTrendingTopicIds = await fetchWeeklyTrendingTopics();
    const weeklyTrendingTopics = await Promise.all(
        weeklyTrendingTopicIds.map(
            async (id) => await fetchOPTopicById(id.topic_id),
        ),
    );
    weeklyTrendingTopics.forEach((t, index) => {
        message += `\n*${index + 1}. *[${t.title}](${t.first_post_url}) *by ${t.author_username}*\n`;
        message += `${dropLastSentence(t.summary)}\n\n`;

        const communityFeedback = sanitizeAIListOutput(t.community_summary);
        message += `*Community Feedback:*\n`;
        message += `${communityFeedback.map((str) => `- ${str}`).join("\n")}\n`;
    });

    return message;
}
