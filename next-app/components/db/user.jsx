"use server";
import { sql } from "./sql";
import { postgresInsertArrayFromJsArray } from "./utilities";

export async function createUser(username, chatid) {
    let currTime = new Date().getTime();
    currTime = Math.floor(currTime / 1000);

    const insertQuery = `
    INSERT INTO telegram_users (id, chatid, premium, email, bookmarks, subscriptions, pause_alerts, telegram_alerts, email_alerts, timestamp)
    VALUES ('${username}', '${chatid}', ${currTime} + (12 * 31 * 24 * 60 * 60), NULL, ARRAY[]::TEXT[], ARRAY[]::TEXT[], FALSE, TRUE, FALSE, ${currTime})
    RETURNING id;
    `;
    return await sql.unsafe(insertQuery);
}

export async function fetchUserData(username, chatid) {
    const userQuery = `
        SELECT *
        FROM telegram_users
        WHERE id = '${username}' AND chatid = '${chatid}'
        LIMIT 1;
    `;
    const users = await sql.unsafe(userQuery);
    if (users && users.length) {
        return users[0];
    }
    return null;
}

export async function fetchAllUsersData() {
    const userQuery = `
        SELECT *
        FROM telegram_users;
    `;
    return await sql.unsafe(userQuery);
}

export async function saveUserBookmarkUpdates(user) {
    const bookmarksPostgres = postgresInsertArrayFromJsArray(user.bookmarks);
    await sql`
    UPDATE telegram_users
    SET bookmarks = ${bookmarksPostgres}
    WHERE id = ${user.id};
    `;
}

export async function saveUserSubscriptionUpdates(user) {
    const subscriptionsPostgres = postgresInsertArrayFromJsArray(
        user.subscriptions,
    );
    await sql`
    UPDATE telegram_users
    SET subscriptions = ${subscriptionsPostgres}
    WHERE id = ${user.id};
    `;
}
