import { getBot } from "@/components/bot";
import { fetchAllUsersData } from "@/components/db/user";

export async function POST() {
    const bot = getBot();
    const text = `
End of the Year Report

Dear Delegates,
As 2024 comes to a close, we'd like to share a few updates and reflect on some key milestones.

*Product Updates*
Thanks to PGov's suggestion, we launched an AI-organized forum tab for Compound and introduced weekly forum summaries. If you would like the same feature for another ecosystem, please chat with us (@ken12358, @Atlantropaz)!

*Milestones*
Tribuni has grown from an ETH Denver hackathon project to a Telegram app used by 80 delegates, representing 32.4M votes in Optimism, 370k in Compound, and more across other ecosystems. We've fulfilled the OP grant requirements and are honored to be a RetroFunding Round 6 recipient. Thank you for leaving reviews on Metrics Garden and EAS.

*Looking Ahead*
We plan to expand the AI forum to more ecosystems and explore futarchy, among other ideas. Feel free to DM us or share your thoughts in the [alpha group](https://t.me/+GQxcYz_80B40ZGMx).

Happy holidays!
`;
    // const users = await fetchAllUsersData();
    const users = ((await fetchAllUsersData()).filter(u => u.id == "ken12358"));
    for (const user of users) {
        const userId = user.id;
        const chatId = user.chatid;
        const buttons = [
            [
                {
                    text: "Subscribe to Compound",
                    callback_data: "sub compound",
                },
            ],
            [
                {
                    text: "AI-Organized Compound Forum",
                    web_app: {
                        url: `${process.env.SERVER_URL}/forum/compound?username=${userId}&chatid=${chatId}`,
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
            await bot.sendMessage(chatId, text, telegramMessageOptions);
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
