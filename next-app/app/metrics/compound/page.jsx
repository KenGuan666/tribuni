"use client";
import Head from "next/head";
import { useEffect, useState } from "react";
import { fetchAllUsersData } from "@/components/db/user";
import { getCompoundVotePower } from "@/components/blockchain/compound/votePower";

export default function Page() {
    const [users, setUsers] = useState([]);
    const [votePowerByDelegate, setVotePowerByDelegate] = useState(new Map());

    const fetchData = async () => {
        let users = await fetchAllUsersData();
        setUsers(users);

        let map = new Map();
        const delegates = users.filter((u) => u.evm_delegate_addresses);
        await Promise.all(
            delegates.map(async (u) =>
                Promise.all(
                    u.evm_delegate_addresses.map(async (addr) => {
                        const voteCount = await getCompoundVotePower(addr);
                        const voteCountNumber = Number(
                            voteCount.toBigInt() / 10n ** 18n,
                        );
                        if (voteCountNumber) {
                            map.set(addr, voteCountNumber);
                        }
                    }),
                ),
            ),
        );
        setVotePowerByDelegate(map);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const delegatesCount = votePowerByDelegate.size;
    const totalDelegateVotePower = Array.from(
        votePowerByDelegate.values(),
    ).reduce((s, power) => s + power, 0);

    const subscribers = users.filter((u) =>
        u.subscriptions.includes("optimism"),
    );

    return (
        <div>
            <Head>
                <title>Compound Metrics</title>
            </Head>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                    gap: "50px",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    {normalText("Tribuni is supporting", true)}
                    {highlightText(`${delegatesCount}`, true)}
                    {normalText("Compound delegates with", true)}
                    {highlightText(`${totalDelegateVotePower}`, true)}
                    {normalText("votes combined!")}
                </div>
            </div>
        </div>
    );
}

const highlightText = (text, spaceAfter) => (
    <div
        style={{
            marginRight: spaceAfter ? "12px" : "0px",
            color: "#01d396",
            fontSize: 32,
            fontWeight: 1200,
        }}
    >
        {text}
    </div>
);

const normalText = (text, spaceAfter) => (
    <div
        style={{
            marginRight: spaceAfter ? "12px" : "0px",
            fontsize: 40,
            fontWeight: 600,
        }}
    >
        {text}
    </div>
);
