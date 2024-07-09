import { removeBookmarksForUser } from "./bookmarks";

export const HandleCallback = async ({ bot, body }) => {
    // let words = body.callback_query.data.split(" ");
    const query = body.callback_query;
    const userId = query.from.username;
    const chatId = query.message.chat.id;
    const callback_data = query.data;

    // hacky way to parse protocol name from message
    const protocolName = query.message.text
        .split("community")[0]
        .slice(2)
        .trim();

    // callback_data always contains query_path and params separated by a space
    const [query_path, query_params] = callback_data.split(" ");
    if (query_path == "book") {
        const proposalsToRemove = query_params.split(",");
        try {
            await removeBookmarksForUser(userId, chatId, proposalsToRemove);
            bot.sendMessage(
                chatId,
                `You won't be alerted again for the ${proposalsToRemove.length} ${protocolName} proposals. Thanks for voting!`,
            );
            bot.answerCallbackQuery(query.id, {});
        } catch (err) {
            bot.answerCallbackQuery(query.id, {
                text: `Encountered error: ${err.message}. Please contact Tribuni support.`,
            });
        }
    }
};
