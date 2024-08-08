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
                    "You are a blockchain governance expert and you are tasked with providing analysis of an online forum post with 2 or 3 bullet points. You should use your knowledge of blockchain governance to provide insights into the post. It should be unique and distinct from the summary of the post. Limit your response to less than 100 characters. Do not start your response with 'Insights' or 'Post Insights.' Only return the text of the insights. Do not use Markdown, only use plain text. Use a bullet point character at beginning of each point. Ensure that your insights sound as human-like as possible.",
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

export async function getPostSentiment(summary, reply) {
    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: "system",
                content:
                    "You are a blockchain governance expert and you are tasked with identifying whether a reply supports or opposes an online forum post. You need to respond only with 'Supports' or 'Opposes'. Do not use Markdown, only use plain text. Only respond with 'Supports' or 'Opposes'.",
            },
            {
                role: "user",
                content: `Here is the post: ${summary}.\n\nHere is the reply: ${reply}`,
            },
        ],
        model: process.env.LLM,
    });
    const response = completion.choices[0].message.content;
    return response === "Supports";
}

export async function getPostCommunityFeedback(post, replies) {
    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: "system",
                content:
                    "You are a blockchain governance expert and you are tasked with summarizing the community's feedback about an online forum post with 2 or 3 bullet points. Limit your response to less than 150 characters. Do not use Markdown, only use plain text. Use a bullet point character at beginning of each point. No other separators or brackets. Ensure that your response sounds as human-like as possible.",
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

export async function getForumWeeklySummary(titles) {
    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: "system",
                content:
                    "You are a blockchain governance expert and you are tasked with providing a short summary of a week of activity on an online forum by analyzing the post titles on that forum. You should provide a summary of the most important topics discussed during the week. Limit your response to less than 150 characters. Start with 'This week,' without the quote. Do not start your response with 'Summary' or 'Weekly Summary.' Only return the text of the summary. Do not use Markdown, only use plain text. Ensure that your summary sounds as human-like as possible.",
            },
            {
                role: "user",
                content: `Here is a ||-separated list of titles: ${titles.join("||")}`,
            },
        ],
        model: process.env.LLM,
    });
    return completion.choices[0].message.content;
}
