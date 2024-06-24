"use client";
import clsx from "clsx";
import React, { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import { ANIMATE, BASE_USER, MAX_WIDTH } from "@/components/constants";
import { Proposal } from "./Proposal";
import { PageLoader } from "@/components/loaders";
import { useStore } from "@/store";

export default function Page({ params, searchParams }) {
    const { proposalId } = params;
    const { username, chatid, routeSource } = searchParams;
    // proposalData is a single-page state
    let [proposalData, setProposalData] = useState(null);
    let { user, setUser } = useStore();

    useEffect(() => {
        const fetchData = async () => {
            if (proposalData == null) {
                try {
                    const res = await fetch(
                        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v4/data/proposals?proposalId=${proposalId}`,
                        {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                            },
                        },
                    );
                    const data = await res.json();
                    proposalData = data.proposalData;
                    console.log(proposalData);
                    setProposalData(proposalData);
                } catch (err) {
                    console.log(err);
                }
            }

            if (user == BASE_USER) {
                try {
                    const res = await fetch(
                        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v4/data/user`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                id: username,
                                chatid: chatid,
                            }),
                        },
                    );
                    const data = await res.json();
                    user = data.user;
                    setUser(user);
                    console.log("Set user: ", user);
                } catch (err) {
                    console.log(err);
                }
            }
        };

        fetchData();
    });

    return (
        <PageLoader
            children={
                // Set screen width to be consistent with other pages
                <div
                    className={clsx(
                        "flex flex-col w-full p-4 grow bg-isSystemLightSecondary overflow-hidden",
                        MAX_WIDTH,
                    )}
                >
                    {/* Make the page scrollable */}
                    <div
                        id="proposal-detail"
                        className={clsx(
                            "w-full overflow-y-auto grow !space-y-2 text-md hide-scrollbar rounded-xl mt-5 pb-20",
                            ANIMATE,
                            MAX_WIDTH,
                            "mt-3",
                        )}
                    >
                        <Proposal proposalData={proposalData} />
                    </div>
                </div>
            }
        />
    );
}
