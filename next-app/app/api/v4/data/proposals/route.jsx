import { sql, sanitizeText } from "@/components/db";
import { fetchProposalData } from "@/components/db/proposal";

export async function POST(req) {
    try {
        const body = req.json();

        const proposalsQuery = `SELECT * FROM proposals WHERE protocol = '${body.protocol}';`;
        let proposals = await sql.unsafe(proposalsQuery);
        let proposalMap = proposals.reduce((map, item) => {
            map[item.id] = item;
            return map;
        }, {});

        const infoQuery = `SELECT * FROM protocols WHERE id = '${body.protocol}';`;
        let protocolInfo = await sql.unsafe(infoQuery);
        protocolInfo = protocolInfo[0];

        return Response.json(
            {
                status: "success",
                protocolInfo: protocolInfo,
                proposalMap: proposalMap,
            },
            { status: 201 },
        );
    } catch (err) {
        console.log(err);
        return Response.json(
            {
                status: "error",
                protocolInfo: null,
                proposalMap: null,
            },
            { status: 403 },
        );
    }
}

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const proposalId = searchParams.get("proposalId");
    try {
        return Response.json(
            { proposalData: await fetchProposalData(proposalId) },
            { status: 201 },
        );
    } catch (err) {
        console.log(err);
        return Response.json(
            {
                proposalsData: null,
                message: "could not fetch proposal data",
            },
            { status: 503 },
        );
    }
}
