"use client";

import React from "react";
import { useState } from "react";
import { Title } from "@/components/ui/page";
import { SearchBar } from "@/components/page";
import { useStore } from "@/store";
import { isInThePast } from "@/utils/time";
import { ProposalList } from "./ProposalList";

export const BookmarkPage = ({ proposals }) => {
    let [search, setSearch] = useState("");
    const { getCachedProtocol } = useStore();

    let proposalToProtocolNameMap = proposals.reduce(
        (map, proposal) =>
            map.set(proposal.id, getCachedProtocol(proposal.protocol).name),
        new Map(),
    );

    const filteredProposals = proposals.filter((proposal) => {
        let _search = search.toLowerCase();
        const isMatch =
            !search ||
            // search term matches proposal title
            proposal.title.toLowerCase().startsWith(_search) ||
            // search term matches proposal class (e.g. Protocol Upgrade)
            (proposal.proposal_class &&
                proposal.proposal_class.toLowerCase().startsWith(_search)) ||
            // search term matches protocol id (e.g. optimism)
            proposal.protocol.toLowerCase().startsWith(_search) ||
            // search term matches protocol public name (e.g. Optimism)
            proposalToProtocolNameMap
                .get(proposal.id)
                .toLowerCase()
                .startsWith(_search);

        return isMatch;
    });

    const sortedFilteredProposals = filteredProposals.sort((p1, p2) => {
        const p1time = p1.endtime;
        const p2time = p2.endtime;
        // ongoing proposals are always before completed proposals
        if (isInThePast(p1time) && !isInThePast(p2time)) {
            return 1;
        }
        if (isInThePast(p2time) && !isInThePast(p1time)) {
            return -1;
        }
        // sort by endtime, then protocol alphabetically, then title alphabetically
        return (
            p1.endtime - p2.endtime ||
            proposalToProtocolNameMap
                .get(p1.id)
                .localeCompare(proposalToProtocolNameMap.get(p2.id)) ||
            p1.title.localeCompare(p2.title)
        );
    });

    return (
        <React.Fragment>
            <Title text="Bookmarks" />

            {proposals.length > 0 && (
                <SearchBar
                    searchTerm={search}
                    setSearch={setSearch}
                    placeholder={"Search by protocol, title or type"}
                />
            )}
            <ProposalList proposals={sortedFilteredProposals} />
        </React.Fragment>
    );
};
