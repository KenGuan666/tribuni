/*
    populateFallbackUrl: identify a reasonable "Vote Now" link if Boardroom API doesn't provide one
    The fallback logic is per-protocol. If there's no good logic, fallback to linking a Google search result
*/
export function populateFallbackUrl(dbEntry, rawProposal) {
    const protocolId = dbEntry.protocol;
    if (protocolId == "optimism") {
        dbEntry["url"] = `https://vote.optimism.io/proposals/${rawProposal.id}`;
    } else if (protocolId == "arbitrum") {
        dbEntry["url"] =
            `https://www.tally.xyz/gov/arbitrum/proposal/${rawProposal.id}`;
    } else if (protocolId == "aave") {
        const proposalRawId = parseInt(rawProposal.id, 10);
        if (!isNaN(proposalRawId)) {
            dbEntry["url"] =
                `https://app.aave.com/governance/v3/proposal/?proposalId=${proposalRawId}`;
        }
    } else {
        dbEntry["url"] =
            `https://www.google.com/search?q=${protocolId} ${dbEntry["title"]}`;
    }
}
