"use client";
import clsx from "clsx";
import { fetchUserData } from "@/components/db/user";
import { fetchProposalsByIds } from "@/components/db/proposal";
import { fetchProtocolsByIds } from "@/components/db/protocol";
import { BASE_USER, MAX_WIDTH } from "@/components/constants";
import { PageLoader, Spinner } from "@/components/loaders";
import { UserConnector } from "@/components/Connectors";
import React, { useState, useEffect } from "react";
import { useStore } from "@/store";
import { BookmarkPage } from "./BookmarkPage";

export default function Page({ searchParams }) {
    const { username, chatid } = searchParams;
    let {
        user,
        setUser,
        cacheProposals,
        getCachedProposal,
        cacheProtocols,
        getCachedProtocol,
    } = useStore();
    let [proposalsData, setProposalsData] = useState(null);
    let [protocolsInfo, setProtocolsInfo] = useState(null);

    const _fetchUserData = async () => {
        try {
            const userData = await fetchUserData(username, chatid);
            user = userData;
            setUser(userData);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchProposalsData = async () => {
        try {
            const proposalsDataDb = await fetchProposalsByIds(user.bookmarks);
            proposalsData = proposalsDataDb;
            setProposalsData(proposalsDataDb);
            cacheProposals(proposalsData);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchProtocolsData = async (protocolIds) => {
        try {
            const protocolsInfoDb = await fetchProtocolsByIds(protocolIds);
            protocolsInfo = protocolsInfoDb;
            setProtocolsInfo(protocolsInfoDb);
            cacheProtocols(protocolsInfo);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchData = async () => {
        // Bookmark page is an entry point. It must be able to load user from params
        if (user == BASE_USER) {
            await _fetchUserData();
        }

        // load bookmarked proposals
        if (!proposalsData && user != BASE_USER) {
            // first, try loading proposalsData from cache
            let proposalsDataFromCache = [];
            user.bookmarks.forEach((proposalId) => {
                const proposalData = getCachedProposal(proposalId);
                if (proposalData) {
                    proposalsDataFromCache.push(proposalData);
                }
            });
            if (proposalsDataFromCache.length == user.bookmarks.length) {
                proposalsData = proposalsDataFromCache;
                setProposalsData(proposalsDataFromCache);
            } else {
                // if proposals are not cached, load from db
                await fetchProposalsData();
            }
        }

        // load protocol metadata for bookmarked proposals
        if (!protocolsInfo && proposalsData) {
            // first, try loading protocolsInfo from cache
            const protocolIds = Array.from(
                proposalsData
                    .reduce(
                        (map, proposalData) =>
                            map.set(proposalData.protocol, true),
                        new Map(),
                    )
                    .keys(),
            );
            let protocolsInfoFromCache = [];
            protocolIds.forEach((protocolId) => {
                const protocolInfo = getCachedProtocol(protocolId);
                if (protocolInfo) {
                    protocolsInfoFromCache.push(protocolInfo);
                }
            });
            if (protocolsInfoFromCache.length == protocolIds.length) {
                protocolsInfo = protocolsInfoFromCache;
                setProtocolsInfo(protocolsInfoFromCache);
            } else {
                // if protocols are not cached, load from db
                await fetchProtocolsData(protocolIds);
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Render a spinner until all data loaded
    if (!proposalsData || !protocolsInfo || user == BASE_USER) {
        return <Spinner />;
    }

    return (
        <PageLoader
            children={
                <div
                    className={clsx(
                        "flex flex-col w-full h-screen overflow-hidden",
                        MAX_WIDTH,
                    )}
                >
                    <div className="flex flex-col grow overflow-y-scroll hide-scrollbar">
                        <BookmarkPage proposals={proposalsData} />
                    </div>
                    <UserConnector />
                </div>
            }
        />
    );
}
