import { saveUsers } from "@/components/db/supabase";
import { alertContentWithProposals } from "@/app/api/v4/alerts/alertContent";
import { pushTelegramAlerts } from "@/app/api/v4/alerts/telegram/telegram";

export async function bookmarkAndAlertForSubscribers(supabase, proposalsData) {
    if (!proposalsData.length) {
        return undefined;
    }
    // create a protocolId -> [proposalIds] map
    const proposalIdsByProtocolMap = proposalsData.reduce(
        (map, proposalData) => {
            const proposalIds = map.get(proposalData.protocol) || [];
            proposalIds.push(proposalData.id);
            return map.set(proposalData.protocol, proposalIds);
        },
        new Map(),
    );

    // get all users which subscribed to at least one protocol with new proposals
    const protocolIds = Array.from(proposalIdsByProtocolMap.keys());
    let { data: usersToUpdate, err } = await supabase
        .from("telegram_users")
        .select("*")
        .or(protocolIds.map((id) => `subscriptions.cs.{${id}}`).join(","));

    if (err) {
        return err;
    }
    // add new proposals of subscribed protocols for each user
    usersToUpdate.forEach((user) => {
        user.subscriptions.forEach((protocolId) => {
            const newProposalIds = proposalIdsByProtocolMap.get(protocolId);
            if (newProposalIds) {
                newProposalIds.forEach((proposalId) =>
                    user.bookmarks.includes(proposalId)
                        ? null
                        : user.bookmarks.push(proposalId),
                );
            }
        });
    });
    console.log(`updating bookmarks for ${usersToUpdate.length} users`);

    // upsert the users back to db
    err = await saveUsers(supabase, usersToUpdate);
    if (err) {
        return err;
    }

    // push alerts for users
    // const alertContents = await alertContentWithProposals(
    //     usersToUpdate,
    //     proposalsData,
    // );
    // await pushTelegramAlerts(alertContents, "new");
    return undefined;
}
