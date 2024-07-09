import { relativeTimeLabel } from "@/utils/time";
import { getBot } from "@/components/bot";

export async function pushTelegramAlerts(alertContents) {
    const bot = getBot();
    let promises = [];

    // Each alertContent of each user leads to a Telegram message
    alertContents.forEach(({ protocolInfo, proposalsData, user }) => {
        // show the most urgent proposal first
        proposalsData.sort((p1, p2) => p1.endtime - p2.endtime);
        const alertText = generateAlertMarkdownText(
            protocolInfo,
            proposalsData,
        );
        const alertButtons = generateAlertButtons(user, proposalsData);

        const telegramMessageOptions = {
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: alertButtons,
            },
        };
        promises.push(
            bot.sendMessage(user.chatid, alertText, telegramMessageOptions),
        );
    });
    await Promise.all(promises);
}

function generateAlertMarkdownText(protocolInfo, proposalsData) {
    let message = "";
    const firstProposal = proposalsData[0];

    message += `📣 *${protocolInfo.name}* community is voting on *${proposalsData.length} proposals*!\n`;
    message += "\n";
    message += `1. *${firstProposal.title}*\n`;
    message += `${firstProposal.summary}\n`;

    if (proposalsData.length > 1) {
        message += "\n";
        message += `2. ... View under 📌 _My Bookmarks_.\n`;
    }
    message += "\n";
    message += `⏰ Vote Ends *${relativeTimeLabel(firstProposal.endtime)}*\n`;
    return message;
}

function generateAlertButtons(user, proposalsData) {
    const userId = user.id;
    const chatId = user.chatid;
    // TODO: add metrics collection using Telegram API's callback feature

    // "View my Bookmarks" takes user to bookmarks page in web-app
    const bookmarkButton = {
        text: "My Bookmarks",
        web_app: {
            url: `${process.env.SERVER_URL}/bookmarks?username=${userId}&chatid=${chatId}`,
        },
    };
    // "Vote now" takes user to voting page in browser
    const voteNowButton = {
        text: "🗳️ Vote now",
        url: proposalsData[0].url,
    };

    // "Alert Settings" takes user to setting page in web-app
    // const settingsButton = {
    //     text: "Alert Settings",
    //     web_app: {
    //         url: `${process.env.SERVER_URL}/settings?username=${userId}&chatid=${chatId}`,
    //     }
    // }
    var votedButton;

    // "I Voted!" unbookmarks related proposals
    // Telegram bot will reply with confirmation

    // callback_data can be at most 64 bytes.
    // we'll encode proposals to remove by first 5 chars of their id
    const callback_data =
        `book ${proposalsData.map((p) => p.id.slice(0, 5))}`.slice(0, 64);

    if (proposalsData.length === 1) {
        votedButton = {
            text: "I Voted!",
            callback_data,
        };
    } else {
        votedButton = {
            text: `I Voted on all ${proposalsData.length}!`,
            callback_data,
        };
    }
    return [[voteNowButton], [votedButton, bookmarkButton]];
}
