import OpenAI from "openai";
import { PROPOSAL_CLASSES } from "@/constants/proposalClasses";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const proposalClassString = PROPOSAL_CLASSES.join(", ");
export async function labelProposal(proposalSummary) {
    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: "system",
                content: `You are a blockchain governance expert and you are tasked classifying a governance proposal based on a summary of its content. The available classes are: [${proposalClassString}]. Your response must be one of these classes. Do not include quotations or additional text in your response. Only output the class to which you determine the proposal to belong.`,
            },
            {
                role: "user",
                content: `Here is the proposal summary: ${proposalSummary}`,
            },
        ],
        model: process.env.LLM,
    });

    return completion.choices[0].message.content;
}
