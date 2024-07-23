"use client";
import { useEffect, useState } from "react";
import Head from "next/head";
import { fetchAllUsersData } from "@/components/db/user";
import { CountByTimeChart } from "./CountByTime";

export default function Page() {
    const [userJoinTime, setUserJoinTime] = useState([]);
    const fetchData = async () => {
        const users = await fetchAllUsersData();
        setUserJoinTime(users.map((user) => user.timestamp).sort());
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            <Head>
                <title>Metrics</title>
            </Head>
            <CountByTimeChart timestamps={userJoinTime} />
        </div>
    );
}
