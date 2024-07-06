export async function bookmarkForSubscribers(supabase, proposalEntries) {
    if (!proposalEntries.length) {
        return undefined;
    }
    // create a protocolId -> [proposalIds] map
    const proposalIdsByProtocolMap = proposalEntries.reduce((map, entry) => {
        const proposalIds = map.get(entry.protocol) || [];
        proposalIds.push(entry.id);
        return map.set(entry.protocol, proposalIds);
    }, new Map());

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
                    user.bookmarks.push(proposalId),
                );
            }
        });
    });
    console.log(`updating bookmarks for ${usersToUpdate.length} users`);

    // upsert the users back to db
    const res = await supabase.from("telegram_users").upsert(usersToUpdate, {
        onConflict: "id",
        ignoreDuplicates: false,
    });
    return res.error;
}
