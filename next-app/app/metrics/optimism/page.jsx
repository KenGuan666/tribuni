"use client";
import Head from "next/head";
import { useEffect, useState } from "react";
import { fetchAllUsersData } from "@/components/db/user";
import {
    fetchExistingTopicsCount,
    fetchPostCount,
} from "@/components/db/op_forum";
import { getOpVotePower } from "@/components/blockchain/optimism/votePower";

export default function Page() {
    const [users, setUsers] = useState([]);
    const [votePowerByDelegate, setVotePowerByDelegate] = useState(new Map());
    const [topicCount, setTopicCount] = useState(0);
    const [postCount, setPostCount] = useState(0);

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

        const topicCount = await fetchExistingTopicsCount();
        setTopicCount(topicCount);
        const postCount = await fetchPostCount();
        setPostCount(postCount);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const delegates = users.filter((u) => u.op_delegate_address);
    const totalDelegateVotePower = Array.from(
        votePowerByDelegate.values(),
    ).reduce((s, power) => s + power, 0);

    const subscribers = users.filter((u) =>
        u.subscriptions.includes("optimism"),
    );

    return (
        <div>
            <Head>
                <title>Optimism Metrics</title>
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
                    {highlightText(`${delegates.length}`, true)}
                    {normalText("OP delegates with", true)}
                    {highlightText(`${totalDelegateVotePower}`, true)}
                    {normalText("votes combined!")}
                </div>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    {normalText("Tribuni has helped", true)}
                    {highlightText(`${subscribers.length}`, true)}
                    {normalText("subscribers analyze", true)}
                    {highlightText(`${postCount}`, true)}
                    {normalText("posts across", true)}
                    {highlightText(`${topicCount}`, true)}
                    {normalText("forum topics", true)}
                </div>
            </div>
        </div>
    );
}

const highlightText = (text, spaceAfter) => (
    <div
        style={{
            marginRight: spaceAfter ? "12px" : "0px",
            color: "red",
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
