"use client";
import clsx from "clsx";
import React, { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import { ProposalContent } from "./ProposalContent";
import { fetchProposalById } from "@/components/db/proposal";
import { fetchProtocolById } from "@/components/db/protocol";
import { fetchUserData } from "@/components/db/user";
import { ANIMATE, BASE_USER, MAX_WIDTH } from "@/components/constants";
import { PageLoader } from "@/components/loaders";
import { Navigator } from "@/components/page/Navigator";
import { useStore } from "@/store";

export default function Page({ params, searchParams }) {
    const { proposalId } = params;
    if (!proposalId) return notFound();
    const { username, chatid, from } = searchParams;

    let {
        user,
        setUser,
        setPageLoading,
        getCachedProtocol,
        cacheProtocol,
        getCachedProposal,
        cacheProposal,
    } = useStore();

    const cachedProposalInfo = getCachedProposal(proposalId);
    // proposalData, protocolInfo are single-page states
    let [proposalData, setProposalData] = useState(cachedProposalInfo);
    let [protocolInfo, setProtocolInfo] = useState(null);

    let backLink = "",
        backText = "";

    const fetchData = async () => {
        let promises = [];
        if (!proposalData) {
            setPageLoading(true);
            promises.push(
                fetchProposalById(proposalId).then(
                    (res) => {
                        proposalData = res;
                        setProposalData(proposalData);
                        cacheProposal(proposalData);
                    },
                    (err) => {
                        console.log(err);
                    },
                ),
            );
        }
        // proposalPage is an entry point. It must be able to load user from params
        if (user == BASE_USER) {
            setPageLoading(true);
            promises.push(
                fetchUserData(username, chatid).then(
                    (res) => {
                        user = res;
                        setUser(user);
                    },
                    (err) => {
                        console.log(err);
                    },
                ),
            );
        }
        await Promise.all(promises);

        if (proposalData) {
            protocolInfo = getCachedProtocol(proposalData.protocol);
            if (protocolInfo) {
                setProtocolInfo(protocolInfo);
            } else {
                setPageLoading(true);
                try {
                    protocolInfo = await fetchProtocolById(
                        proposalData.protocol,
                    );
                    setProtocolInfo(protocolInfo);
                    cacheProtocol(protocolInfo);
                } catch (err) {
                    console.log(err);
                }
            }
        }
        setPageLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    // if linked from "proposals", back button links to protocol's proposal page
    // TODO: implement routing for Bookmarks and alert entry
    if (from == "proposals" || true) {
        backText = protocolInfo?.name;
        backLink = `${process.env.NEXT_PUBLIC_SERVER_URL}/proposals?protocol=${protocolInfo?.id}&username=${user?.id}&chatid=${user?.chatid}`;
    }

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
                        <ProposalContent proposalData={proposalData} />
                    </div>
                </div>
            }
        />
    );
}
