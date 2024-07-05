"use client";
import clsx from "clsx";
import { fetchUserData } from "@/components/db/user";
import { fetchProposalsByIds } from "@/components/db/proposal";
import { UserConnector } from "@/components/Connectors";
import { BASE_USER, MAX_WIDTH } from "@/components/constants";
import { Spinner } from "@/components/loaders";
import React, { useState, useEffect } from "react";
import { useStore } from "@/store";

export default function Page({ searchParams }) {
    const { username, chatid } = searchParams;
    let { user, setUser, setPageLoading } = useStore();
    let [proposalsData, setProposalsData] = useState(null);

    const fetchData = async () => {
        // Bookmark page is an entry point. It must be able to load user from params
        if (user == BASE_USER) {
            try {
                const userData = await fetchUserData(username, chatid);
                user = userData;
                setUser(userData);
            } catch (err) {
                console.log(err);
            }
        }
        if (!proposalsData && user != BASE_USER) {
            try {
                const proposalsDataDb = await fetchProposalsByIds(
                    user.bookmarks,
                );
                proposalsData = proposalsDataDb;
                setProposalsData(proposalsDataDb);
            } catch (err) {
                console.log(err);
            }
        }
        // setPageLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Render a spinner until all data loaded
    if (!proposalsData || user == BASE_USER) {
        return <Spinner />;
    }

    return (
        <div className={clsx("w-full h-full pb-24", MAX_WIDTH)}>
            <div className="w-full flex flex-row p-4 space-x-3 text-4xl font-700 h-full bg-isSystemLightSecondary rounded-2xl items-center place-content-center p-4">
                <div className="text-isLabelLightSecondary">Coming</div>{" "}
                <div className="text-isBlack">Soon</div>
            </div>
            <UserConnector />
        </div>
    );
}
