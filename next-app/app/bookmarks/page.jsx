"use client";
import clsx from "clsx";
import { fetchUserData } from "@/components/db/user";
import { UserConnector } from "@/components/Connectors";
import { BASE_USER, MAX_WIDTH } from "@/components/constants";
import React, { useEffect } from "react";
import { useStore } from "@/store";

export default function Page({ searchParams }) {
    const { username, chatid } = searchParams;
    let { user, setUser, setPageLoading } = useStore();

    const fetchData = async () => {
        let promises = [];
        // Bookmark page is an entry point. It must be able to load user from params
        if (user == BASE_USER) {
            promises.push(
                fetchUserData(username, chatid).then(
                    (userData) => {
                        user = userData;
                        setUser(userData);
                    },
                    (err) => {
                        console.log(err);
                    },
                ),
            );
        }
        await Promise.all(promises);
        setPageLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

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
