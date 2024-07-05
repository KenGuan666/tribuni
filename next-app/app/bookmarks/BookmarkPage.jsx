"use client";

import React from "react";
import { useState } from "react";
import { Title } from "@/components/ui/page";
import { SearchBar } from "@/components/page";
import { ProposalList } from "./ProposalList";

export const BookmarkPage = ({ proposals }) => {
    let [search, setSearch] = useState("");

    const filteredProposals = proposals.filter((proposal) => {
        const isMatch =
            !search ||
            proposal.title.toLowerCase().startsWith(search.toLowerCase()) ||
            proposal.proposal_class
                .toLowerCase()
                .startsWith(search.toLowerCase()) ||
            proposal.protocol.toLowerCase().startsWith(search.toLowerCase());

        return isMatch;
    });

    return (
        <React.Fragment>
            <Title text="Bookmarks" />
            <SearchBar
                searchTerm={search}
                setSearch={setSearch}
                placeholder={"Search by protocol, title or type"}
            />
            <ProposalList proposals={filteredProposals} />
        </React.Fragment>
    );
};
