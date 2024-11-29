import { relativeTimeLabel } from "@/utils/time";
import { getBot } from "@/components/bot";

export async function pushTelegramAlerts(alertContents, variation) {
    if (variation == "unimplemented") {
        return;
    }
    const bot = getBot();
    let promises = [];

    // Each alertContent of each user leads to a Telegram message
    alertContents.forEach(({ protocolInfo, proposalsData, user }) => {
        // show the most urgent proposal first
        proposalsData.sort((p1, p2) => p1.endtime - p2.endtime);
        const alertText = generateAlertMarkdownText(
            protocolInfo,
            proposalsData,
            variation,
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

function generateAlertMarkdownText(protocolInfo, proposalsData, variation) {
    let message = "";
    const firstProposal = proposalsData[0];

    let firstLine = "";
    if (variation == "new") {
        firstLine = `📣 ${proposalsData.length} new *${protocolInfo.name}* proposal${proposalsData.length > 1 ? "s" : ""}!`;
    }
    if (variation == "ending") {
        firstLine = `📣 ${proposalsData.length} *${protocolInfo.name}* proposal${proposalsData.length > 1 ? "s" : ""} close${proposalsData.length > 1 ? "" : "s"} in 48 hours!`;
    }

    message += firstLine;
    message += "\n";

    proposalsData.slice(0, 5).forEach((proposalData, index) => {
        if (proposalsData.length > 1) {
            message += `*${index + 1}. *`;
        }
        message += `*${proposalData.title}*\n`;
        message += `${proposalData.summary}\n`;
        message += "\n";
    })

    if (proposalsData.length > 5) {
        message += `View all under 📌 _My Bookmarks_.\n`;
    }

    const date = new Date(firstProposal.endtime * 1000);
    const formattedDate = date.toLocaleString();
    message += `⏰ Vote Ends at *${formattedDate}*\n`;
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
        text: "Go to Proposal",
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

    votedButton = {
        text: "I Voted!",
        callback_data,
    };
    return [[voteNowButton], [votedButton, bookmarkButton]];
}
