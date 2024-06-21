import { sql, sanitizeText } from "@/components/db";

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
