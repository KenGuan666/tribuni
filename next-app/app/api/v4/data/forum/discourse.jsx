const urlByProtocol = {
    optimism: ["https://gov.optimism.io", process.env.DISCOURSE_API_KEY_OP],
    compound: ["https://www.comp.xyz", process.env.DISCOURSE_API_KEY_COMP],
};
const getOptions = {
    method: "GET",
    headers: { Accept: "application/json" },
};

export async function getTopicsFromDiscourse(protocol) {
    const url = discourseURL(protocol, "top.json", ["period=monthly"]);
    const res = await fetch(url, getOptions);
    return await res.json();
}

export async function getTopicPostsFromDiscourse(protocol, topicId) {
    const url = discourseURL(protocol, `t/${topicId}.json`, []);
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

export async function getPostFromDiscourse(protocol, postId) {
    const url = discourseURL(protocol, `posts/${postId}.json`, []);
    const res = await fetch(url, getOptions);
    return await res.json();
}

export async function getCategory(protocol, categoryId) {
    const url = discourseURL(protocol, `c/${categoryId}/show.json`, []);
    const res = await fetch(url, getOptions);
    try {
        const resJson = await res.json();
        return resJson.category;
    } catch (error) {
        console.log(`Cannot parse response from discourse: `);
    }
}

export function forumAvatarFromTemplate(protocol, template) {
    let [baseURL, _] = urlByProtocol[protocol];
    const prefix = template[0] === "/" ? baseURL : "";
    return `${prefix}${template.replace("{size}", 64)}`;
}

export function postUrl(protocol, topic, postNumber) {
    let [baseURL, _] = urlByProtocol[protocol];
    return `${baseURL}/t/${topic.slug}/${topic.id}/${postNumber}`;
}

function discourseURL(protocol, path, params) {
    let [baseURL, apiKey] = urlByProtocol[protocol];
    return `${baseURL}/${path}?${params.map((p) => `${p}&`).join("")}Api-Key=${apiKey}&Api-Username=system`;
}
