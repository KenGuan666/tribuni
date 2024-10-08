import { removeBookmarksForUser } from "./bookmarks";
import { subscribeForUser } from "./subscription";
import { sendGA4Events } from "@/utils/ga4";

export const HandleCallback = async ({ bot, body }) => {
    // let words = body.callback_query.data.split(" ");
    const query = body.callback_query;
    const userId = query.from.username;
    const chatId = query.message.chat.id;
    const callback_data = query.data;

    // callback_data always contains query_path and params separated by a space
    const [query_path, query_params] = callback_data.split(" ");
    try {
        if (query_path == "book") {
            const proposalsToRemove = query_params.split(",");
            await removeBookmarksForUser(userId, chatId, proposalsToRemove);
            await bot.sendMessage(
                chatId,
                `You won't be alerted again. Thanks for voting!`,
            );
            console.log(
                "sending metrics event:",
                "alert_delete_bookmark_event",
            );
            sendGA4Events(userId, "alert_delete_bookmark_event", [
                {
                    username: userId,
                },
            ]);

            await bot.answerCallbackQuery(query.id, {});
        }
        if (query_path == "sub") {
            const protocolsToSubscribe = query_params.split(",");
            await subscribeForUser(userId, chatId, protocolsToSubscribe);
            await bot.sendMessage(
                chatId,
                `You have subscribed to ${protocolsToSubscribe}.`,
            );
            await bot.answerCallbackQuery(query.id, {});
        }
    } catch (err) {
        bot.answerCallbackQuery(query.id, {
            text: `Encountered error: ${err.message}. Please contact Tribuni support.`,
        });
    }
};
