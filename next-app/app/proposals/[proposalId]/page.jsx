"use client";
import clsx from "clsx";
import React, { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import { Proposal } from "./Proposal";
import { fetchProposalById } from "@/components/apiHelper/proposal";
import { fetchProtocolById } from "@/components/apiHelper/protocol";
import { fetchUser } from "@/components/apiHelper/user";
import { ANIMATE, BASE_USER, MAX_WIDTH } from "@/components/constants";
import { PageLoader } from "@/components/loaders";
import { Navigator } from "@/components/page/Navigator";
import { useStore } from "@/store";

export default function Page({ params, searchParams }) {
    const { proposalId } = params;
    if (!proposalId) return notFound();
    const { username, chatid, from } = searchParams;
    // proposalData, protocolInfo are single-page states
    let [proposalData, setProposalData] = useState(null);
    let [protocolInfo, setProtocolInfo] = useState(null);
    // user is an app-wide state
    let { user, setUser, setPageLoading } = useStore();
    let backLink = "", backText = "";

    const fetchData = async () => {
        let promises = [];
        if (proposalData == null) {
            setPageLoading(true);
            promises.push(
                fetchProposalById(proposalId).then(proposalData => {
                    setProposalData(proposalData);
                    return proposalData;
                }, err => {
                    console.log(err);
                })
            )
        }
        if (user == BASE_USER) {
            setPageLoading(true);
            promises.push(
                fetchUser(username, chatid).then(user => {
                    setUser(user);
                    return user;
                }, err => {
                    console.log(err);
                })
            )
        }
        const [resolvedProposalData, _] = await Promise.all(promises)

        if (protocolInfo == null) {
            setPageLoading(true);
            try {
                protocolInfo = await fetchProtocolById(resolvedProposalData.protocol);
                setProtocolInfo(protocolInfo);
            } catch (err) {
                console.log(err);
            }
        }
        setPageLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    // if linked from "proposals", back button links to protocol's proposal page
    // TODO: implement routing for Bookmarks and alert entry
    backText = protocolInfo?.name;
    backLink = `${process.env.NEXT_PUBLIC_SERVER_URL}/proposals?protocol=${protocolInfo?.id}&username=${user?.id}&chatid=${user?.chatid}`;

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
                    <Navigator text={backText} link={backLink} />
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
