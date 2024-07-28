"use client";
import clsx from "clsx";
import { notFound } from "next/navigation";
import { useState, useEffect } from "react";
import { Header } from "./Header";
import { ProposalPreviewList } from "./ProposalPreviewList";
import { SubscriptionSwitch } from "./SubscriptionSwitch";
import { fetchProposalByProtocolId } from "@/components/db/proposal";
import { fetchProtocolById } from "@/components/db/protocol";
import { fetchUserData } from "@/components/db/user";
import { ANIMATE, BASE_USER, MAX_WIDTH } from "@/components/constants";
import { PageLoader, Spinner } from "@/components/loaders";
import { Navigator } from "@/components/page/Navigator";
import { useStore } from "@/store";

export default function Page({ searchParams }) {
    const { username, chatid, protocol } = searchParams;
    if (!protocol) return notFound();

    let {
        user,
        setUser,
        getCachedProtocol,
        cacheProtocol,
        getCachedProposalsByProtocol,
        cacheProposalsByProtocol,
    } = useStore();

    const cachedProtocolInfo = getCachedProtocol(protocol);
    let [protocolInfo, setProtocolInfo] = useState(cachedProtocolInfo);

    const cachedProposalsByProtocol = getCachedProposalsByProtocol(protocol);
    let [proposalMap, setProposalMap] = useState(cachedProposalsByProtocol);

    const fetchData = async () => {
        let promises = [];
        if (!proposalMap) {
            promises.push(
                fetchProposalByProtocolId(protocol).then(
                    (proposalsData) => {
                        proposalMap = proposalsData.reduce(
                            (map, proposalData) => {
                                map[proposalData.id] = proposalData;
                                return map;
                            },
                            new Map(),
                        );
                        setProposalMap(proposalMap);
                        cacheProposalsByProtocol(protocol, proposalsData);
                    },
                    (err) => {
                        console.log(err);
                    },
                ),
            );
        }
        if (!protocolInfo) {
            promises.push(
                fetchProtocolById(protocol).then(
                    (protocolInfoData) => {
                        setProtocolInfo(protocolInfoData);
                        cacheProtocol(protocolInfoData);
                    },
                    (err) => {
                        console.log(err);
                    },
                ),
            );
        }
        // Protocol proposal page is an entry point. It must be able to load user from params
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
        // setPageLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    // do not render anything until all elements are loaded
    if (!proposalMap || !protocolInfo || user == BASE_USER) {
        return <Spinner />;
    }

    return (
        <PageLoader
            children={
                <div
                    className={clsx(
                        "flex flex-col w-full p-4 grow bg-isSystemLightSecondary overflow-hidden",
                        MAX_WIDTH,
                    )}
                >
                    {/* Navigator: the Back button */}
                    <Navigator
                        link={`/protocols?username=${username}&chatid=${chatid}`}
                        text={"Protocols"}
                    />

                    {/* Allow proposal header to be hidden by scrolling down */}
                    <div
                        className={clsx(
                            "w-full overflow-y-auto grow !space-y-2 text-md hide-scrollbar mt-5 pb-20",
                            ANIMATE,
                            MAX_WIDTH,
                        )}
                    >
                        {/* Header: Protocol name, icon */}
                        <Header protocolInfo={protocolInfo} />

                        {/* SubscriptionSwitch: Subscription state */}
                        <SubscriptionSwitch protocolId={protocol} />

                        {/* ProposalList: display list of proposals, or the detail of the selected proposal */}
                        <ProposalPreviewList
                            proposalMap={proposalMap}
                            protocol={protocol}
                        />
                    </div>
                </div>
            }
            title={protocolInfo.name}
        />
    );
}
