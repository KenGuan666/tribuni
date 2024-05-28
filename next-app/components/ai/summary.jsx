import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function summarizeProposal(proposal) {
    const completion = await openai.chat.completions.create({
        messages: [
            { "role": "system", "content": "You are a blockchain governance expert and you are tasked with providing a two-sentence summary of a proposal to the user. The first sentence should describe the purpose of the proposal, and the second sentence should describe any relevant context, motivations, or impacts related to the proposal. Limit your response to less than 300 characters." },
            { "role": "user", "content": `Here is the proposal: ${proposal}` }
        ],
        model: process.env.LLM
    });

    return completion.choices[0].message.content;
}