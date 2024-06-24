
const endpoint = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v4/data/proposals`;

async function fetchProposalWithParams(params) {
    const res = await fetch(
        `${endpoint}?${params}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        },
    );
    const data = await res.json();
    return data.proposalData;
}

export async function fetchProposalById(proposalId) {
    return await fetchProposalWithParams(`proposalId=${proposalId}`)
}

export async function fetchProposalByProtocolId(protocolId) {
    return await fetchProposalWithParams(`protocolId=${protocolId}`)
}
