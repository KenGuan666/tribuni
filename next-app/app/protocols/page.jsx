"use client";
import React, { useState, useEffect } from "react";
import { ProtocolContent } from "./ProtocolContent";
import clsx from "clsx";
import { fetchProtocolsWithActiveAndNewCols } from "@/components/db/protocol";
import { fetchUserData } from "@/components/db/user";
import { UserConnector } from "@/components/Connectors";
import { BASE_USER, MAX_WIDTH } from "@/components/constants";
import { PageLoader } from "@/components/loaders";
import { useStore } from "@/store";

export default function Page({ searchParams }) {
    const { username, chatid } = searchParams;
    let { user, setUser, setPageLoading, cacheProtocols } = useStore();

    let [protocolsInfo, setProtocolsInfo] = useState(null);

    const fetchData = async () => {
        let promises = [];
        if (!protocolsInfo) {
            promises.push(
                fetchProtocolsWithActiveAndNewCols().then(
                    (protocols) => {
                        console.log(protocols)
                        protocolsInfo = protocols
                        setProtocolsInfo(protocols)
                        cacheProtocols(protocols.map(
                            ({ id, name, icon }) => {
                                return {
                                    id,
                                    name,
                                    icon,
                                }
                            })
                        )
                    },
                    (err) => {
                        console.log(err);
                    },
                )
            )
        }
        // Protocol page is an entry point. It must be able to load user from params
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
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <PageLoader
            children={
                <div
                    className={clsx(
                        "flex flex-col items-center w-full grow overflow-hidden pb-24",
                        MAX_WIDTH,
                    )}
                >
                    <ProtocolContent
                        protocols={protocolsInfo}
                        lastUpdated={new Date().toUTCString()}
                    />

                    <UserConnector />
                </div>
            }
        />
    );
}
