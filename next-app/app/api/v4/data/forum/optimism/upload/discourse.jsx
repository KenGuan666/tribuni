const baseURL = "https://gov.optimism.io";
const getOptions = {
    method: "GET",
    headers: { Accept: "application/json" },
};

export async function getTopicsFromDiscourse() {
    const url = discourseURL("top.json", ["period=monthly"]);
    const res = await fetch(url, getOptions);
    return await res.json();
}

export async function getTopicPostsFromDiscourse(topicId) {
    const url = discourseURL(`t/${topicId}.json`, []);
    const res = await fetch(url, getOptions);
    const resJson = await res.json();

    let postIds = new Set(resJson.post_stream.posts.map((p) => p.id));

    for (const postId of resJson.post_stream.stream) {
        if (!postIds.has(postId)) {
            resJson.post_stream.posts.push(await getPostFromDiscourse(postId));
        }
    }
    return resJson;
}

export async function getPostFromDiscourse(postId) {
    const url = discourseURL(`posts/${postId}.json`, []);
    const res = await fetch(url, getOptions);
    return await res.json();
}

export async function getCategory(categoryId) {
    const url = discourseURL(`c/${categoryId}/show.json`, []);
    const res = await fetch(url, getOptions);
    try {
        const resJson = await res.json();
        return resJson.category;
    } catch (error) {
        console.log(`Cannot parse response from discourse: `);
    }
}

function discourseURL(path, params) {
    return `${baseURL}/${path}?${params.map((p) => `${p}&`).join("")}Api-Key=${process.env.DISCOURSE_API_KEY}&Api-Username=system`;
}
