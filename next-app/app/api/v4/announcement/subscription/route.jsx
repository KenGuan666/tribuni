import { getBot } from "@/components/bot";
import { fetchAllUsersData } from "@/components/db/user";

export async function POST() {
    const bot = getBot();
    const forumReleaseText = `
👋 Hey there! I see Tribuni hasn't sent you any alerts because it doesn't know which projects you follow.

Subscribe to protocols now under \"View All Protocols\" and stay on top of governance!

Join our [alpha group](https://t.me/+GQxcYz_80B40ZGMx) for product updates and technical support.
`;
    const users = await fetchAllUsersData();
    const usersWithoutSubscription = users.filter((u) => u.id == "lg_group");
    for (const user of usersWithoutSubscription) {
        const userId = user.id;
        const chatId = user.chatid;
        const buttons = [
            [
                {
                    text: "Subscribe to Optimism",
                    callback_data: "sub optimism",
                },
            ],
            [
                {
                    text: "View All Protocols",
                    web_app: {
                        url: `${process.env.SERVER_URL}/protocols?username=${userId}&chatid=${chatId}`,
                    },
                },
            ],
        ];

        const telegramMessageOptions = {
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: buttons,
            },
        };

        try {
            await bot.sendMessage(
                chatId,
                forumReleaseText,
                telegramMessageOptions,
            );
        } catch (err) {
            console.log(`could not announce to ${userId}`);
            console.log(err);
        }
    }
    return Response.json(
        {
            message: "Success",
        },
        { status: 201 },
    );
}
