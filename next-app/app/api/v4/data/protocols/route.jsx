import { sql, sanitizeText } from "@/components/db";
import { fetchProtocolById } from "@/components/db/protocol";

export async function POST(req) {
    try {
        // 		const query = `
        // SELECT
        //     p.id AS id,
        //     p.name AS name,
        //     p.icon AS icon,
        //     COUNT(pr.id) AS count
        // FROM
        //     protocols p
        // LEFT JOIN
        //     proposals pr ON p.id = pr.protocol
        // GROUP BY
        //     p.id, p.name, p.icon;
        // `;

        const query = `
    SELECT
        p.id AS id,
        p.name AS name,
        p.icon AS icon,
        COUNT(pr.protocol) AS total,
        SUM(CASE WHEN pr.endtime > EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) THEN 1 ELSE 0 END) AS active,
        SUM(CASE WHEN pr.starttime < EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) AND EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) - pr.starttime <= 48 * 3600 THEN 1 ELSE 0 END) AS new
    FROM
        protocols p
    LEFT JOIN
        proposals pr ON p.id = pr.protocol
    GROUP BY
        p.id, p.name, p.icon;
`;

        let protocols = await sql.unsafe(query);

        protocols = protocols.map(({ name, count, ...rest }) => {
            return {
                name: name.trim(),
                count: parseInt(count),
                ...rest,
            };
        });

        protocols.sort((a, b) => {
            return a.name.localeCompare(b.name);
        });

        const total = protocols.reduce(
            (acc, protocol) => acc + parseInt(protocol.total || 0, 10),
            0,
        );

        return Response.json(
            {
                status: "success",
                protocols: protocols,
                total: total,
            },
            { status: 201 },
        );
    } catch (err) {
        console.log(err);
        return Response.json(
            {
                status: "error",
                protocols: null,
                total: 0,
            },
            { status: 403 },
        );
    }
}

/*
    Return protocols based on provided params
    Supported params:
        proposalId: id of proposal. If proposalId provided, all other filters are automatically ignored
        protocol: id of protocol.
*/
export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const protocolId = searchParams.get("protocol");

    if (protocolId) {
        try {
            return Response.json(
                { protocolData: await fetchProtocolById(protocolId) },
                { status: 201 },
            );
        } catch (err) {
            console.log(err);
            return Response.json(
                {
                    protocolData: null,
                    message: `could not fetch protocol data: ${err}`,
                },
                { status: 503 },
            );
        }
    }
    return Response.json(
        { message: `please provide a filter` },
        { status: 400 },
    );
}
