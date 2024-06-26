"use client";

import React from "react";
import clsx from "clsx";
import { useState } from "react";
import { ANIMATE, delay, MAX_WIDTH } from "@/components/constants";
import { MagnifyingGlass, SquareTextSquareFill } from "@/components/ios";
import { Cancel } from "@/components/material-rounded/Cancel";
import { useStore } from "@/store";
import { Hr, Tabs, Title } from "@/components/ui/page";
import { ProtocolList } from "./ProtocolList";

export const ProtocolContent = ({ protocols }) => {
    if (!protocols) {
        return null;
    }
    const { user, protocolFilter, setProtocolFilter } = useStore();
    const [search, setSearch] = useState("");

    const filteredProtocols = protocols.filter((protocol) => {
        const isMatch = protocol.name
            .toLowerCase()
            .startsWith(search.toLowerCase());

        if (protocolFilter === "subscribed") {
            return isMatch && user.subscriptions.includes(protocol.id);
        } else if (protocolFilter === "active") {
            return isMatch && protocol.active;
        } else {
            return isMatch;
        }
    });

        return (
            <React.Fragment>
                <Title text="Protocols" />

                <div
                    className={clsx(
                        "flex flex-row items-center w-full px-4 shrink-0 pt-3",
                        ANIMATE,
                        MAX_WIDTH,
                    )}
                >
                    <div className="flex flex-row items-center w-full py-1 px-2 space-x-1 rounded-xl place-content-center bg-isFillLightTertiary">
                        <MagnifyingGlass
                            classes={clsx(
                                "w-7 h-7 fill-isLabelLightSecondary shrink-0",
                            )}
                        />

                        <input
                            id="search"
                            placeholder="Search"
                            onChange={(e) => {
                                setSearch(e.target.value);
                            }}
                            value={search}
                            type="text"
                            className={clsx(
                                "grow bg-transparent outline-none text-lg focus:outline-none font-400 placeholder:text-isLabelLightSecondary text-isLabelLightPrimary leading-none",
                                ANIMATE,
                            )}
                        />

                        {search !== "" && (
                            <button
                                onClick={async () => {
                                    setSearch("");
                                    const div =
                                        document.getElementById("search");

                                    await delay(20);

                                    if (div) {
                                        div.focus();
                                    }
                                }}
                            >
                                <Cancel
                                    classes={clsx(
                                        "w-[1.2rem] h-[1.2rem] fill-isLabelLightSecondary shrink-0",
                                    )}
                                />
                            </button>
                        )}
                    </div>
                </div>

                <Tabs
                    list={["all", "subscribed", "active"]}
                    setter={setProtocolFilter}
                    active={protocolFilter}
                    classes={clsx("pt-8")}
                />

                {(protocolFilter === "all" ||
                    protocolFilter === "active" ||
                    protocolFilter === "subscribed") && (
                    <ProtocolList
                        protocols={filteredProtocols}
                        showIndex={true}
                        search={search}
                    />
                )}
            </React.Fragment>
        );
};
