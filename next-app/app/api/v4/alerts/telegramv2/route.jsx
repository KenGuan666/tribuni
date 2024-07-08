import { fetchUserData } from "@/components/db/user";
import { isInThePast, isNearUTCSecondStampNow } from "@/utils/time";
import { alertContentForUsers } from "../alertContent";
import { pushTelegramAlerts } from "./telegram";

/*
    POST: this endpoint sends v2 telegram alerts to users when called

    A v2 telegram alert concerns a single Protocol. It contains:
        - all proposals of the Protocol bookmarked by the user
        - summary of the first proposal
        - a series of buttons leading user into the telegram bot or voting site

    Params:
        username (string): telegram handle of the target user (e.g. ken12358)
            if provided, only send alert to specified user
            must be provided together with chatid
        chatid (string): telegram-generated id which identifies specified user's chat
            must be provided together with username
        test (boolean): if true, the alert will be fired regardless of the user's alert settings
*/
export async function POST(req) {
    let requestBody = {};
    try {
        requestBody = await req.json();
    } catch (err) {
        return Response.json(
            { message: `Could not parse the alert request: ${err.message}` },
            { status: 500 },
        );
    }

    // determine users who will receive the alert
    var users;
    if (requestBody.username && requestBody.chatid) {
        // If a username and chatid is provided, only alert this user
        const user = await fetchUserData(
            requestBody.username,
            requestBody.chatid,
        );

        // If a bad username is provided, return 400
        if (!user) {
            return Response.json(
                { message: `Could not find user ${requestBody.username}` },
                { status: 400 },
            );
        }
        users = [user];
    } else {
        // If no username or chatid is provided, alert all users
        users = await fetchUsersEligibleForAlertNow();
    }

    // Filter users eligible to receive alerts based on settings, if "test" param is not True
    if (!requestBody.test) {
        users = users.filter((user) => {
            return (
                user.telegram_alerts && // alert is enabled
                !user.pause_alerts && // alert is not paused
                isInThePast(user.last_telegram_alert + user.duration) && // last alert was fired long enough ago
                isNearUTCSecondStampNow(user.alert_time, 30)
            ); // user opted to receive alerts at this minute
        });
    }
    console.log(
        `sending Telegram alerts to users with userid: ${users.map((user) => user.id)}`,
    );

    // organize alert contents to be pushed by user
    const alertContentsByUser = await alertContentForUsers(users);
    if (!alertContentsByUser) {
        return Response.json(
            { message: `Could not prepare alerts` },
            { status: 500 },
        );
    }
    try {
        await pushTelegramAlerts(alertContentsByUser);
        return Response.json(
            {
                message: "Successfully sent telegram alerts",
                n_alerts: users.length,
            },
            { status: 201 },
        );
    } catch (err) {
        console.log(err);
        return Response.json(
            { message: `Could not send telegram alerts: ${err.message}` },
            { status: 500 },
        );
    }
}
