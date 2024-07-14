export async function getProtocolsFromBoardroom() {
    const protocolsURL = `https://api.boardroom.info/v1/protocols?key=${process.env.BOARDROOM_API_KEY}`;
    const protocolsOptions = {
        method: "GET",
        headers: { Accept: "application/json" },
    };
    const protocolsResponse = await fetch(protocolsURL, protocolsOptions);
    const protocolsResJson = await protocolsResponse.json();
    return protocolsResJson.data;
}

export async function getProposalsFromBoardroom(protocolId) {
    const proposalsURL = `https://api.boardroom.info/v1/protocols/${protocolId}/proposals?status=active&key=${process.env.BOARDROOM_API_KEY}`;
    const proposalsOptions = {
        method: "GET",
        headers: { Accept: "application/json" },
    };
    const proposalsResponse = await fetch(proposalsURL, proposalsOptions);
    return await proposalsResponse.json();
}
