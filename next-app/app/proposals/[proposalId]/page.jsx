"use client";
import clsx from "clsx";
import React, { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import { Proposal } from "./Proposal";
import { fetchProposalById } from "@/components/apiHelper/proposal";
import { fetchUser } from "@/components/apiHelper/user";
import { ANIMATE, BASE_USER, MAX_WIDTH } from "@/components/constants";
import { PageLoader } from "@/components/loaders";
import { useStore } from "@/store";

export default function Page({ params, searchParams }) {
    const { proposalId } = params;
    if (!proposalId) return notFound();
    const { username, chatid, routeSource } = searchParams;
    // proposalData is a single-page state
    let [proposalData, setProposalData] = useState(null);
    // user is an app-wide state
    let { user, setUser } = useStore();

    const fetchData = async () => {
        if (proposalData == null) {
            try {
                proposalData = await fetchProposalById(proposalId);
                setProposalData(proposalData);
            } catch (err) {
                console.log(err);
            }
        }

        if (user == BASE_USER) {
            try {
                user = await fetchUser(username, chatid);
                setUser(user);
            } catch (err) {
                console.log(err);
            }
        }
    };

    useEffect(() => {
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
                    {/* Make the proposal info page scrollable */}
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
