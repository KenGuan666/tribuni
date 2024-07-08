import { relativeTimeLabel } from "@/utils/time";
import { getBot } from "@/components/bot";

export async function pushTelegramAlerts(alertContentsByUser) {
    const bot = getBot();
    let promises = [];

    // Each alertContent of each user leads to a Telegram message
    alertContentsByUser.forEach((alertContents, [userId, chatId]) => {
        alertContents.forEach(({ protocolInfo, proposalsData }) => {
            // show the most urgent proposal first
            proposalsData.sort((p1, p2) => p1.endtime - p2.endtime);
            const alertText = generateAlertMarkdownText(
                protocolInfo,
                proposalsData,
            );
            const alertButtons = generateAlertButtons(
                userId,
                chatId,
                proposalsData,
            );

            const telegramMessageOptions = {
                parse_mode: "Markdown",
                reply_markup: {
                    inline_keyboard: alertButtons,
                },
            };
            promises.push(
                bot.sendMessage(chatId, alertText, telegramMessageOptions),
            );
        });
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

function generateAlertButtons(userId, chatId, proposalsData) {
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
    // TODO: instead of taking user to web-app, handle unbookmark in background and reply
    if (proposalsData.length === 1) {
        votedButton = {
            text: "I Voted!",
            web_app: {
                url: `${process.env.SERVER_URL}/bookmarks?username=${userId}&chatid=${chatId}`,
            },
        };
    } else {
        votedButton = {
            text: `I Voted on all ${proposalsData.length}!`,
            web_app: {
                url: `${process.env.SERVER_URL}/bookmarks?username=${userId}&chatid=${chatId}`,
            },
        };
    }
    return [[voteNowButton], [votedButton, bookmarkButton]];
}
