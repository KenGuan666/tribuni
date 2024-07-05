"use server";
import { sql } from "./sql";
import { postgresLookupArrayFromJsArray } from "./utilities";

export async function fetchProtocolById(protocolId) {
    const query = `
        SELECT *
        FROM protocols
        WHERE id = '${protocolId}'
        LIMIT 1;
    `;
    const protocols = await sql.unsafe(query);
    if (protocols.length) {
        return protocols[0];
    }
    return {};
}

export async function fetchProtocolsByIds(protocolIds) {
    const protocolIdsPostgres = postgresLookupArrayFromJsArray(protocolIds);
    const query = `
        SELECT *
        FROM protocols
        WHERE id IN ${protocolIdsPostgres};
    `;
    return await sql.unsafe(query);
}

export async function fetchProtocolsWithActiveAndNewCols() {
    const query = `
    SELECT
        p.id AS id,
        p.name AS name,
        p.icon AS icon,
        SUM(CASE WHEN pr.endtime > EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) THEN 1 ELSE 0 END) AS active,
        SUM(CASE WHEN pr.starttime < EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) AND EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) - pr.starttime <= 48 * 3600 THEN 1 ELSE 0 END) AS _new
    FROM
        protocols p
    LEFT JOIN
        proposals pr ON p.id = pr.protocol
    GROUP BY
        p.id, p.name, p.icon;
    `;
    const expandedProtocols = await sql.unsafe(query);
    return expandedProtocols
        .map(({ name, _new, active, ...rest }) => {
            return {
                name: name.trim(),
                _new: parseInt(_new),
                active: parseInt(active),
                ...rest,
            };
        })
        .sort((a, b) => a.name.localeCompare(b.name));
}
