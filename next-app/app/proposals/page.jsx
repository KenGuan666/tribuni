"use client";
import clsx from "clsx";
import { notFound } from "next/navigation";
import { useState, useEffect } from "react";
import { Header } from "./Header";
import { RenderList } from "./RenderList";
import { Navigator } from "./Navigator";
import { Manage } from "./Manage";
import { fetchProposalByProtocolId } from "@/components/apiHelper/proposal";
import { fetchProtocolById } from "@/components/apiHelper/protocol";
import { fetchUser } from "@/components/apiHelper/user";
import { BASE_USER, MAX_WIDTH } from "@/components/constants";
import { PageLoader } from "@/components/loaders";
import { useStore } from "@/store";

export default function Page({ searchParams }) {
    const { username, chatid, protocol } = searchParams;
    if (!protocol) return notFound();

    let [proposalMap, setProposalMap] = useState(null);
    let [protocolInfo, setProtocolInfo] = useState(null);
    let { user, setUser } = useStore();

    const fetchData = async () => {
        if (proposalMap == null) {
            try {
                const proposalsData = await fetchProposalByProtocolId(protocol);
                proposalMap = proposalsData.reduce((map, proposalData) => {
                    map[proposalData.id] = proposalData;
                    return map
                }, new Map())
                setProposalMap(proposalMap);
            } catch (err) {
                console.log(err);
            }
        }
        if (protocolInfo == null) {
            try {
                protocolInfo = await fetchProtocolById(protocol);
                setProtocolInfo(protocolInfo);
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
    }

    useEffect(() => {
        fetchData();
    })

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
                    <Navigator protocolName={protocolInfo?.name} userId={user?.id} chatid={user?.chatid} />

                    {/* Header: Protocol name, icon */}
                    <Header protocolInfo={protocolInfo} />

                    {/* Manage: Subscription state */}
                    <Manage protocolId={protocol} />

                    {/* RenderList: display list of proposals, or the detail of the selected proposal */}
                    <RenderList proposalMap={proposalMap} protocol={protocol} />
                </div>
            }
        />
    );
}
