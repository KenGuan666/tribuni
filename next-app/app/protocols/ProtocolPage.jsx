"use client";

import React from "react";
import clsx from "clsx";
import { useState } from "react";
import { ANIMATE, MAX_WIDTH } from "@/components/constants";
import { Tabs, Title } from "@/components/ui/page";
import { SearchBar } from "@/components/page";
import { useStore } from "@/store";
import { ProtocolList } from "./ProtocolList";

export const ProtocolPage = ({ protocols }) => {
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

            <SearchBar
                searchTerm={search}
                setSearch={setSearch}
                placeholder="Search by protocol name"
            />

            <Tabs
                list={["all", "subscribed", "active"]}
                setter={setProtocolFilter}
                active={protocolFilter}
                classes={clsx("pt-8")}
            />

            <ProtocolList
                protocols={filteredProtocols}
                showIndex={true}
                search={search}
            />
        </React.Fragment>
    );
};
