import { getBot } from "@/components/bot";
import { fetchAllUsersData } from "@/components/db/user";

export async function POST() {
    const bot = getBot();
    const text = `
❤️ *Tribuni needs your help!* ❤️

Kindly give Tribuni a 5-star review if Tribuni is helpful in your journey as an OP delegate. Your review will improve our chance of funding and keeping the service free for delegates.

*Please sign an on-chain review following steps below*:
1. Open [on-chain attestation service EAS](https://optimism.easscan.org/attestation/attestWithSchema/0xdaef21c0f7e40e6f1fd4afe8fd0a2a438176bf2a333e47f93515feac14a1cb1a)

2. Connect with your OP delegate wallet address

3. Fill 
- RECIPIENT: "0xEdD95782d13902Ae535332b5D233041E47aD69E6"
- APP NAME: "Tribuni". Give us a score between 1-5 under ""
- SCORE: Rating between 1-5 with 5 being the highest
- APP REVIEW: Your review

4. Toggle the Onchain/Offchain option to "Onchain". Click "Make attestation".

Please also give us a boost on social media!
[X](https://x.com/0xTribuni/status/1831099688189391141) | [OP Forum](https://gov.optimism.io/t/tribuni-alpha-launch-telegram-mini-app-built-by-delegates-for-delegates/8568/13)
`;
    const users = await fetchAllUsersData();
    const subscribers = users.filter(
        (u) => u.subscriptions.includes("optimism"),
    );
    for (const user of subscribers) {
        const userId = user.id;
        const chatId = user.chatid;

        const telegramMessageOptions = {
            parse_mode: "Markdown",
        };

        try {
            await bot.sendMessage(
                chatId,
                text,
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
