import { notFound } from "next/navigation";
import { Header } from "./Header";
import { RenderList } from "./RenderList";
import { sql } from "@/components/db";
import { redirect } from "next/navigation";
import { Navigator } from "./Navigator";
import { Manage } from "./Manage";
import clsx from "clsx";
import { MAX_WIDTH } from "@/components/constants";
import { PageLoader } from "@/components/loaders";

export const revalidate = 0;

export const getData = async ({ protocol }) => {
    const proposalsQuery = `
	SELECT *
FROM proposals
WHERE protocol = '${protocol}';
`;

    let proposals = await sql.unsafe(proposalsQuery);

    const infoQuery = `
	SELECT *
FROM protocols
WHERE id = '${protocol}';
`;

    let protocolInfo = await sql.unsafe(infoQuery);
    protocolInfo = protocolInfo[0];

    let proposalMap = proposals.reduce((map, item) => {
        map[item.id] = item;
        return map;
    }, {});

    return {
        protocolInfo,
        proposalMap,
    };
};

export default async function Page({ searchParams }) {
    const protocol = searchParams.protocol;
    if (!protocol) return notFound();

    const { protocolInfo, proposalMap } = await getData({ protocol });

    return (
        <PageLoader
            children={
                <div
                    className={clsx(
                        "flex flex-col w-full p-4 grow bg-isSystemLightSecondary overflow-hidden",
                        MAX_WIDTH,
                    )}
                >
                    {/* Navigator: the Back button */}
                    <Navigator protocolName={protocol} />

                    {/* Header: Protocol name, icon */}
                    <Header protocolInfo={protocolInfo} />

                    {/* Manage: Subscription state */}
                    <Manage protocolId={protocol} />

                    {/* RenderList: display list of proposals, or the detail of the selected proposal */}
                    <RenderList proposalMap={proposalMap} protocol={protocol} />
                </div>
            }
        />
    );
}
