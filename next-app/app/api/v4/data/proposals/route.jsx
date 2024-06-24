import { fetchProposalById, fetchProposalByProtocolId } from "@/components/db/proposal";

/*
    Return proposals based on provided params
    Supported params:
        proposalId: id of proposal. If proposalId provided, all other filters are automatically ignored
        protocol: id of protocol.
*/
export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const proposalId = searchParams.get("proposalId");

    if (proposalId) {
        // If proposalId is provided, ignore all other filters
        try {
            return Response.json(
                { proposalData: await fetchProposalById(proposalId) },
                { status: 201 },
            );
        } catch (err) {
            console.log(err);
            return Response.json(
                {
                    proposalData: null,
                    message: `could not fetch proposal data: ${err}`,
                },
                { status: 503 },
            );
        }
    }

    const protocolId = searchParams.get("protocol");
    if (protocolId) {
        try {
            return Response.json(
                { proposalData: await fetchProposalByProtocolId(protocolId) },
                { status: 201 },
            )
        } catch (err) {
            console.log(err);
            return Response.json(
                {
                    proposalData: null,
                    message: `could not fetch proposals for protocol ${protocolId}: ${err}`,
                },
                { status: 503 },
            )
        }
    }

    return Response.json(
        { message: `please provide a filter` },
        { status: 400 },
    )
}
