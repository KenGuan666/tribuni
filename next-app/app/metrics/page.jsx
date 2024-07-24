"use client";
import { useEffect, useState } from "react";
import Head from "next/head";
import { fetchAllUsersData } from "@/components/db/user";
import { fetchProtocolsByIds } from "@/components/db/protocol";
import { fetchProposalCountByProtocols } from "@/components/db/proposal";
// import { useStore } from "@/store";
import { CountByTimeChart } from "./CountByTime";
import { Histogram } from "./Histogram";

export default function Page() {
    const [users, setUsers] = useState([]);
    const [protocolsAndCount, setProtocolsAndCount] = useState([]);

    const vipProtocols = ["optimism"];
    const fetchData = async () => {
        let users = await fetchAllUsersData();
        setUsers(users);

        // find subscriber count for top 10 protocols + VIP protocols
        const protocolIdToSubscriptionCount = users.reduce((map, user) => {
            user.subscriptions.forEach((protocolId) => {
                if (!map.get(protocolId)) {
                    map.set(protocolId, 0);
                }
                map.set(protocolId, map.get(protocolId) + 1);
            });
            return map;
        }, new Map());
        const topProtocols = Array.from(protocolIdToSubscriptionCount.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);
        vipProtocols.forEach((protocolId) => {
            if (
                !topProtocols.some(
                    ([_protocolId, _]) => protocolId === protocolId,
                )
            ) {
                topProtocols.push([
                    protocolId,
                    protocolIdToSubscriptionCount.get(protocolId) || 0,
                ]);
            }
        });
        topProtocols.sort((a, b) => b[1] - a[1]);

        const protocolIds = topProtocols.map((l) => l[0]);
        const protocolsInfo = await fetchProtocolsByIds(protocolIds);
        const proposalsCount = await fetchProposalCountByProtocols(protocolIds);
        const protocolNameAndCount = topProtocols.map(([protocolId, count]) => {
            let protocolInfo = {};
            let pCount = 0;
            protocolsInfo.forEach((p) => {
                if (p.id == protocolId) {
                    protocolInfo = p;
                }
            });
            proposalsCount.forEach((p) => {
                if (p.protocol == protocolId) {
                    pCount = p.count;
                }
            });
            return [
                protocolInfo,
                {
                    subscriberCount: count,
                    proposalCount: pCount,
                },
            ];
        });
        setProtocolsAndCount(protocolNameAndCount);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const userJoinTime = users.map((user) => user.timestamp).sort();

    return (
        <div>
            <Head>
                <title>Metrics</title>
            </Head>
            <div style={{ height: "20px" }}></div> {/* Spacer div */}
            {protocolsAndCount.length ? (
                <Histogram data={protocolsAndCount} />
            ) : (
                <div></div>
            )}
            <div style={{ height: "40px" }}></div> {/* Spacer div */}
            <CountByTimeChart timestamps={userJoinTime} />
        </div>
    );
}
