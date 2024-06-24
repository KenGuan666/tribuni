
const endpoint = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v4/data/protocols`;

export async function fetchProtocolById(protocolId) {
    const res = await fetch(
        `${endpoint}?protocol=${protocolId}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        },
    )
    const data = await res.json();
    return data.protocolData;
}
