"use client";
import Head from "next/head";
import { useEffect, useState } from "react";
import { fetchAllUsersData } from "@/components/db/user";
import { getOpVotePower } from "@/components/blockchain/optimism/votePower";

export default function Page() {
    const [users, setUsers] = useState([]);
    const [votePowerByDelegate, setVotePowerByDelegate] = useState(new Map());

    const fetchData = async () => {
        let users = await fetchAllUsersData();
        setUsers(users);

        let map = new Map();
        const delegates = users.filter((u) => u.op_delegate_address);
        await Promise.all(
            delegates.map((u) =>
                getOpVotePower(u.op_delegate_address).then((voteCount) =>
                    map.set(
                        u.op_delegate_address,
                        Number(voteCount.toBigInt() / 10n ** 18n),
                    ),
                ),
            ),
        );
        setVotePowerByDelegate(map);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const delegates = users.filter((u) => u.op_delegate_address);
    const totalDelegateVotePower = Array.from(
        votePowerByDelegate.values(),
    ).reduce((s, power) => s + power, 0);

    return (
        <div>
            <Head>
                <title>Optimism Metrics</title>
            </Head>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                }}
            >
                <div
                    style={{
                        marginRight: "12px",
                        fontsize: 40,
                        fontWeight: 600,
                    }}
                >
                    Tribuni is supporting
                </div>
                <div
                    style={{
                        marginRight: "12px",
                        color: "red",
                        fontSize: 32,
                        fontWeight: 1200,
                    }}
                >
                    {` ${delegates.length} `}
                </div>
                <div
                    style={{
                        marginRight: "12px",
                        fontsize: 40,
                        fontWeight: 600,
                    }}
                >
                    OP delegates with
                </div>
                <div
                    style={{
                        marginRight: "12px",
                        color: "red",
                        fontSize: 32,
                        fontWeight: 1200,
                    }}
                >
                    {` ${totalDelegateVotePower} `}
                </div>
                <div style={{ fontsize: 40, fontWeight: 600 }}>
                    votes combined!
                </div>
            </div>
        </div>
    );
}
