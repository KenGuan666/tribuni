"use client";
import clsx from "clsx";
import { notFound } from "next/navigation";
import { useState, useEffect } from "react";
import { Header } from "./Header";
import { ProposalList } from "./ProposalList";
import { SubscriptionSwitch } from "./SubscriptionSwitch";
import { fetchProposalByProtocolId } from "@/components/db/proposal";
import { fetchProtocolById } from "@/components/db/protocol";
import { fetchUserData } from "@/components/db/user";
import { BASE_USER, MAX_WIDTH } from "@/components/constants";
import { PageLoader } from "@/components/loaders";
import { Navigator } from "@/components/page/Navigator";
import { useStore } from "@/store";

export default function Page({ searchParams }) {
    const { username, chatid, protocol } = searchParams;
    if (!protocol) return notFound();

    let [proposalMap, setProposalMap] = useState(null);
    let [protocolInfo, setProtocolInfo] = useState(null);
    let { user, setUser, setPageLoading } = useStore();

    const fetchData = async () => {
        let promises = [];
        if (proposalMap == null) {
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
                    },
                    (err) => {
                        console.log(err);
                    },
                ),
            );
        }
        if (protocolInfo == null) {
            promises.push(
                fetchProtocolById(protocol).then(
                    (protocolInfoData) => {
                        setProtocolInfo(protocolInfoData);
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

                    {/* Header: Protocol name, icon */}
                    <Header protocolInfo={protocolInfo} />

                    {/* SubscriptionSwitch: Subscription state */}
                    <SubscriptionSwitch protocolId={protocol} />

                    {/* ProposalList: display list of proposals, or the detail of the selected proposal */}
                    <ProposalList
                        proposalMap={proposalMap}
                        protocol={protocol}
                    />
                </div>
            }
        />
    );
}
