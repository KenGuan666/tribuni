import { getBot } from "@/components/bot";
import { fetchAllUsersData } from "@/components/db/user";

export async function POST() {
    const bot = getBot();
    const metricsText = `
Dear OP Delegates on Tribuni, 

On behalf of LauNaMu from Impact Garden want to broadcast the following important msg for Retro Funding 6.  

The OP Citizen House need your valuable input to understand what tooling and infra has provided value to you, and it's only going to take < 10 minutes. [This data](https://gov.optimism.io/t/retro-funding-6-impact-attestation-experiment/8982) will be used to generate metrics for Badgeholders to vote on.

TL;DR
1. Start reviewing *NOW*
2. Deadline to for reviews: *Oct 27th 19:00 UTC*
3. To start, head to [Impact Garden](https://www.metricsgarden.xyz/searchProject/) 
4. Details and a step-by-step guide [here](https://launamu.notion.site/Optimism-s-R6-Experiment-x-Impact-Garden-11c77d07048080208907fa253d1dc80e)
5. *DO NOT* review projects if u have a Conflict of Interest with
`;
    const users = await fetchAllUsersData();
    const delegates = users.filter((u) => u.evm_delegate_addresses);
    for (const user of delegates) {
        const userId = user.id;
        const chatId = user.chatid;

        const telegramMessageOptions = {
            parse_mode: "Markdown",
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
