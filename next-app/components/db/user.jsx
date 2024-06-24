"use server";
import { sql } from "./sql";

export async function fetchUserData(username, chatid) {
    const userQuery = `
        SELECT *
        FROM telegram_users
        WHERE id = '${username}' AND chatid = '${chatid}'
        LIMIT 1;
    `;
    const users = await sql.unsafe(userQuery);
    if (users.length) {
        return users[0];
    }
    return {};
}

export async function saveUserBookmarkUpdates(user) {
    const bookmarksPostgres = `{${user.bookmarks.map((id) => `"${id}"`).join(",")}}`;
    await sql`
    UPDATE telegram_users
    SET bookmarks = ${bookmarksPostgres}
    WHERE id = ${user.id};
    `;
}
