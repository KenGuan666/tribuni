import { fetchUserData, saveUserSubscriptionUpdates } from "@/components/db/user";

export async function subscribeForUser(
    userId,
    chatId,
    protocolsToSubscribe,
) {
    const user = await fetchUserData(userId, chatId);
    let updated = false;
    for (const protocolId of protocolsToSubscribe) {
        if (!user.subscriptions.includes(protocolId)) {
            user.subscriptions.push(protocolId);
            updated = true;
        }
    }
    if (updated) {
        await saveUserSubscriptionUpdates(user);
    }
}
