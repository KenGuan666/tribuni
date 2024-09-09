import { fetchUserData, fetchAllUsersData } from "@/components/db/user";
import { fetchProposalsByIds } from "@/components/db/proposal";
import { secondsFromNow } from "@/utils/time";
import { alertContentWithProposals } from "../alertContent";
import { pushTelegramAlerts } from "./telegram";

const alertTimeBeforeCompletion = 2 * 86400; // alert 2 days before proposal completes

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
    } catch (err) {}

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
        users = await fetchAllUsersData();
    }

    // Filter users eligible to receive alerts based on settings, if "test" param is not True
    if (!requestBody.test) {
        users = users.filter((user) => {
            return (
                user.telegram_alerts && // alert is enabled
                !user.pause_alerts // alert is not paused
            );
        });
    }

    // Filter proposals by completion time
    const proposalIdsSet = users.reduce((set, user) => {
        user.bookmarks.forEach((proposalId) => set.add(proposalId));
        return set;
    }, new Set());
    const proposalIds = Array.from(proposalIdsSet);
    const bookmarkedProposals = await fetchProposalsByIds(proposalIds);
    const proposalsToAlert = bookmarkedProposals.filter(
        (proposal) => shouldAlertProposal(proposal) || requestBody.test,
    );

    if (!proposalsToAlert.length) {
        return Response.json(
            {
                message:
                    "No proposals completing in exactly 48 hours. No alerts sent.",
            },
            { status: 201 },
        );
    }
    const alertContents = await alertContentWithProposals(
        users,
        proposalsToAlert,
    );
    if (!alertContents) {
        return Response.json(
            { message: `Could not prepare alerts` },
            { status: 500 },
        );
    }
    try {
        await pushTelegramAlerts(alertContents, "ending");
        return Response.json(
            {
                message: "Successfully sent telegram alerts",
                n_proposals: proposalsToAlert.length,
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

export async function GET() {
    return await POST();
}

function shouldAlertProposal(proposalData) {
    const timeUntilCompletion = secondsFromNow(proposalData.endtime);
    return (
        alertTimeBeforeCompletion < timeUntilCompletion &&
        timeUntilCompletion < alertTimeBeforeCompletion + 60
    );
}
