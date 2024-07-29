import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function getPostSummary(text) {
    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: "system",
                content:
                    "You are a blockchain governance expert and you are tasked with providing a two-sentence summary of an online forum post to the user. The first sentence should describe the purpose of the post, and the second sentence should describe any relevant context, motivations, or impacts related to the post. Limit your response to less than 300 characters. Do not start your response with 'Summary' or 'Post Summary.' Only return the text of the summarized post. Do not use Markdown, only use plain text. Ensure that your summary sounds as human-like as possible.",
            },
            { role: "user", content: `Here is the forum post: ${text}` },
        ],
        model: process.env.LLM,
    });
    // console.log("post summary", completion.choices[0].message.content);
    return completion.choices[0].message.content;
}

export async function getPostInsights(text, summary) {
    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: "system",
                content:
                    "You are a blockchain governance expert and you are tasked with providing a two-sentence analysis of an online forum post to the user. You should use your knowledge of blockchain governance to provide insights into the post. It should be unique and distinct from the summary of the post. Limit your response to less than 300 characters. Do not start your response with 'Insights' or 'Post Insights.' Only return the text of the insights. Do not use Markdown, only use plain text. Ensure that your insights sound as human-like as possible.",
            },
            {
                role: "user",
                content: `Here is the forum post: ${text}\n\nHere is the existing summary: ${summary}`,
            },
        ],
        model: process.env.LLM,
    });
    // console.log("insights", completion.choices[0].message.content);
    return completion.choices[0].message.content;
}

export async function getPostSentiment(post, replies) {
    let nSupports = 0;
    let nOpposes = 0;
    for (const reply of replies) {
        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content:
                        "You are a blockchain governance expert and you are tasked with identifying whether a reply supports or opposes an online forum post. You need to respond only with 'Supports' or 'Opposes'. Limit your response to less than 300 characters. Do not use Markdown, only use plain text. Only respond with 'Supports' or 'Opposes'.",
                },
                {
                    role: "user",
                    content: `Here is the post: ${post}.\n\nHere is the reply: ${reply}`,
                },
            ],
            model: process.env.LLM,
        });
        const response = completion.choices[0].message.content;
        if (response === "Supports") {
            nSupports++;
        } else if (response === "Opposes") {
            nOpposes++;
        }
    }
    // console.log("sentiment", {
    //     consensusPercent:
    //         nSupports > nOpposes
    //             ? (nSupports / (nSupports + nOpposes)) * 100
    //             : (nOpposes / (nSupports + nOpposes)) * 100,
    //     consensusValue: nSupports > nOpposes ? "yes" : "no",
    // });

    return {
        consensusPercent:
            nSupports > nOpposes
                ? (nSupports / (nSupports + nOpposes)) * 100
                : (nOpposes / (nSupports + nOpposes)) * 100,
        consensusValue: nSupports > nOpposes ? "yes" : "no",
    };
}

export async function getPostCommunityFeedback(post, replies) {
    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: "system",
                content:
                    "You are a blockchain governance expert and you are tasked with determining bullet points that summarize the community's feedback about an online forum post. You should respond with a list separated by || (without space after the ||) that contains one-sentence statements that summarize the community's feedback. Respond with at most 3 bullet points. Do not use Markdown, only use plain text. Ensure that your response sounds as human-like as possible.",
            },
            {
                role: "user",
                content: `Here is the post: ${post}\n\nHere is a ||-separated list of replies: ${replies.join("||")}`,
            },
        ],
        model: process.env.LLM,
    });
    // console.log(
    //     "community feedback",
    //     completion.choices[0].message.content.split("||"),
    // );
    return completion.choices[0].message.content.split("||");
}

export async function getForumWeeklySummary(posts) {
    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: "system",
                content:
                    "You are a blockchain governance expert and you are tasked with providing a short summary of a week of activity on an online forum by analyzing the posts on that forum. You should provide a summary of the most important topics discussed during the week. Limit your response to less than 300 characters. Do not start your response with 'Summary' or 'Weekly Summary.' Only return the text of the summary. Do not use Markdown, only use plain text. Ensure that your summary sounds as human-like as possible.",
            },
            {
                role: "user",
                content: `Here is a ||-separated list of posts: ${posts.join("||")}`,
            },
        ],
        model: process.env.LLM,
    });
    // console.log("weekly summary", completion.choices[0].message.content);
    return completion.choices[0].message.content;
}

export async function getForumNumTrendingTopics(posts) {
    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: "system",
                content:
                    "You are a blockchain governance expert and you are tasked with counting the number of distinct topics discussed across a set of forum posts. You should provide the number of distinct topics discussed in the posts. Your response should only contain an integer number. Do not use Markdown, only use plain text. Ensure that your response sounds as human-like as possible.",
            },
            {
                role: "user",
                content: `Here is a ||-separated list of posts: ${posts.join("||")}`,
            },
        ],
        model: process.env.LLM,
    });
    // console.log("num trending topics", completion.choices[0].message.content);
    return completion.choices[0].message.content;
}
