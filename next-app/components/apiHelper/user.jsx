const endpoint = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v4/data/user`;

export async function fetchUser(id, chatid) {
    const res = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id,
            chatid,
        }),
    });
    const data = await res.json();
    return data.user;
}
