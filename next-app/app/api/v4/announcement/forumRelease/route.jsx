import { getBot } from "@/components/bot";
import { fetchAllUsersData } from "@/components/db/user";

export async function POST() {
    const bot = getBot();
    const forumReleaseText = `
👀 *Tribuni Feature Announcement*

Tap "Explore OP Forum" for quick, digestible summaries that let you catch up in minutes. Want to stay in the loop without the hassle? Hit "Subscribe to OP" and get a weekly digest straight to your inbox, if you haven't already subscribed.

Relax, we’ve got the OP forum covered for you.

Join our [alpha group](https://t.me/+GQxcYz_80B40ZGMx) for newest product updates and technical support. 
`
    const users = await fetchAllUsersData();
    for (const user of users) {
        const userId = user.id;
        const chatId = user.chatid;
        const buttons = [[
            {
                text: "Subscribe to OP",
                callback_data: "sub optimism",
            },
        ],
        [
            {
                text: "Explore OP Forum",
                web_app: {
                    url: `${process.env.SERVER_URL}/forum/optimism?username=${userId}&chatid=${chatId}`,
                }
            },
        ]]

        const telegramMessageOptions = {
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: buttons,
            },
        };

        await bot.sendMessage(
            chatId,
            forumReleaseText,
            telegramMessageOptions
        )
    }
    return Response.json(
        {
            message: "Success",
        },
        { status: 201 },
    );
}
