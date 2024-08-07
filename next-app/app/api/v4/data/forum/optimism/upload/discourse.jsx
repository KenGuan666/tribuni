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
    return await res.json();
}

export async function getCategory(categoryId) {
    const url = discourseURL(`c/${categoryId}/show.json`, []);
    const res = await fetch(url, getOptions);
    const resJson = await res.json();
    return resJson.category;
}

function discourseURL(path, params) {
    return `${baseURL}/${path}?${params.map((p) => `${p}&`).join("")}Api-Key=${process.env.DISCOURSE_API_KEY}&Api-Username=system`;
}
