import { getBot } from "@/components/bot";

export async function POST() {
    const bot = getBot();
    const userId = "ken12358"
    const chatId = "2114653698"

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

    const forumReleaseText = `
📣 *Feature Announcement*
Get up-to-date with Optimism (OP) forum activity in minutes! Try now by tapping "Explore OP Forum" below.

Tribuni presents you the essence of each forum post, and summarizes community feedback into bullet points. It's truly a must-have for OP forum enthusiasts!

Subscribe to OP now for a weekly digest message!

Join the alpha user group: [https://t.me/+GQxcYz_80B40ZGMx](https://t.me/+GQxcYz_80B40ZGMx)  
Give us a like on the OP forum: [link](https://gov.optimism.io/t/tribuni-alpha-launch-telegram-mini-app-built-by-delegates-for-delegates/8568/5?u=sator)  
Contact us: ask.tribuni@gmail.com
`

    await bot.sendMessage(
        chatId,
        forumReleaseText,
        telegramMessageOptions
    )

    return Response.json(
        {
            message: "Success",
        },
        { status: 201 },
    );
}
