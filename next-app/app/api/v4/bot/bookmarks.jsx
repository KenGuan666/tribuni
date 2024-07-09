import { fetchUserData, saveUserBookmarkUpdates } from "@/components/db/user";

export async function removeBookmarksForUser(
    userId,
    chatId,
    proposalsToRemove,
) {
    const user = await fetchUserData(userId, chatId);
    user.bookmarks = user.bookmarks.filter(
        (id) => !proposalsToRemove.includes(id.slice(0, 5)),
    );
    await saveUserBookmarkUpdates(user);
}
