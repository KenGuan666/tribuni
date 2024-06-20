import { labelProposal } from "@/components/ai/labeler";
import { createClient } from "@supabase/supabase-js";
import { PROPOSAL_CLASSES } from "@/constants/proposalClasses";

export const maxDuration = 60;

export async function POST(req) {
    const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
    );

    const { data, error } = await supabase
        .from("proposals")
        .select("*")
        .neq("id", "");

    const updatedProposals = [];
    for (let proposal of data) {
        const summary = proposal.summary;
        const label = await labelProposal(summary);
        const proposalClass = santizieProposalLabel(label);
        proposal["proposal_class"] = proposalClass;
        updatedProposals.push(proposal);
    }

    for (let proposal of updatedProposals) {
        const { data, error } = await supabase
            .from("proposals")
            .update(proposal)
            .eq("id", proposal.id);
        if (error) {
            console.error(error);
            return Response.json(
                {
                    status: "error",
                },
                { status: 403 },
            );
        }
    }

    return Response.json({
        status: "success",
    });
}

function santizieProposalLabel(label) {
    let result;
    for (let i = 0; i < PROPOSAL_CLASSES.length; i++) {
        if (label.toLowerCase().includes(PROPOSAL_CLASSES[i].toLowerCase())) {
            result = PROPOSAL_CLASSES[i];
            break;
        }
    }
    if (!result) result = "Other";
    return result;
}
