"use client";
import clsx from "clsx";
import { fetchUserData } from "@/components/db/user";
import { fetchProposalsByIds } from "@/components/db/proposal";
import { UserConnector } from "@/components/Connectors";
import { BASE_USER, MAX_WIDTH } from "@/components/constants";
import { Spinner } from "@/components/loaders";
import React, { useState, useEffect } from "react";
import { useStore } from "@/store";
import { BookmarkPage } from "./BookmarkPage";

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
            <BookmarkPage proposals={proposalsData} />
            <UserConnector />
        </div>
    );
}
