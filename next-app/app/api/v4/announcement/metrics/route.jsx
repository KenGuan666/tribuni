import { getBot } from "@/components/bot";
import { fetchAllUsersData } from "@/components/db/user";

export async function POST() {
    const bot = getBot();
    const metricsText = `
❤️ Thank you for choosing Tribuni!

Since our launch, 26 active OP delegates, including you, have chosen Tribuni as their gateway to governance participation. You represent 27.5M OPs in delegated vote power together. That is *30% of total votable OP supply*, *50%+ of votes in recent proposals*, and *healthily above the OP vote quorum*!

We sincerely thank you for your service to the OP community! Kindly help spread the word to other delegates, and send us feature requests or feedback at our [alpha group](https://t.me/+GQxcYz_80B40ZGMx).
`;
    const users = await fetchAllUsersData();
    const delegates = users.filter(u => u.evm_delegate_addresses)
    for (const user of delegates) {
        const userId = user.id;
        const chatId = user.chatid;
        const buttons = [
            [
                {
                    text: "View All Protocols",
                    web_app: {
                        url: `${process.env.SERVER_URL}/protocols?username=${userId}&chatid=${chatId}`,
                    },
                },
            ],
            [
                {
                    text: "Explore OP Forum",
                    web_app: {
                        url: `${process.env.SERVER_URL}/forum/optimism?username=${userId}&chatid=${chatId}`,
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
            await bot.sendMessage(chatId, metricsText, telegramMessageOptions);
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
