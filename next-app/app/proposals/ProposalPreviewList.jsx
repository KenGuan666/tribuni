"use client";

import clsx from "clsx";
import React, { useState } from "react";
import { ANIMATE, MAX_WIDTH } from "@/components/constants";
import { Spinner } from "@/components/loaders";
import { ExclamationmarkSquareFill } from "@/components/ios";
import { Hr, Tabs } from "@/components/ui/page";
import { SearchBar } from "@/components/page";
import { ProposalPreview } from "./ProposalPreview";

export const ProposalPreviewList = ({ proposalMap }) => {
    if (!proposalMap) {
        return <Spinner />;
    }

    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");

    let proposals = Object.keys(proposalMap).map((key) => {
        return proposalMap[key];
    });

    // Order proposals by: active before inactive, ending closer to today before farther
    let timestamp_now = new Date() / 1000;
    proposals.sort((a, b) => {
        if (a.endtime > timestamp_now && b.endtime < timestamp_now) return -1;
        if (a.endtime > timestamp_now && b.endtime > timestamp_now)
            return a.endtime - b.endtime;
        if (a.endtime < timestamp_now && b.endtime > timestamp_now) return 1;
        if (a.endtime < timestamp_now && b.endtime < timestamp_now)
            return b.endtime - a.endtime;
    });

    const filteredProposals = proposals.filter((proposal) => {
        const isMatch =
            proposal.title.toLowerCase().includes(search.toLowerCase()) ||
            proposal.proposal_class
                ?.toLowerCase()
                .includes(search.toLowerCase());
        if (!isMatch) return false;

        const currentTime = Math.floor(Date.now() / 1000);
        const timeDifference = proposal.endtime - currentTime;

        if (filter === "all") {
            return true; // Keep all proposals
        } else if (filter === "active") {
            return timeDifference > 0; // Keep proposals with endtime in the future
        } else if (filter === "completed") {
            return timeDifference < 0; // Keep proposals with endtime in the past
        }

        return false; // Default to false if 'filter' has an unrecognized value
    });

    return (
        <React.Fragment>
            <SearchBar
                searchTerm={search}
                setSearch={setSearch}
                placeholder="Search by proposal title, type"
                classes={clsx("!pt-0 !px-0 !max-w-none mt-1")}
            />

            <Tabs
                list={["all", "active", "completed"]}
                setter={setFilter}
                active={filter}
                classes={clsx("!pt-4 !px-0 !max-w-none mt-1")}
            />

            <div
                id="proposal-detail"
                className={clsx(
                    "w-full grow !space-y-2 text-md hide-scrollbar mt-5",
                    ANIMATE,
                    MAX_WIDTH,
                )}
            >
                <React.Fragment>
                    {/* If there's no proposals with current filter, display some text */}
                    {filteredProposals.length === 0 && (
                        <React.Fragment>
                            <div className="flex flex-col items-center mt-8 place-content-center">
                                <ExclamationmarkSquareFill
                                    classes={clsx(
                                        "h-16 w-16 fill-isGrayLight2",
                                    )}
                                />
                                <div className="w-full text-lg text-center font-600 text-isLabelLightPrimary">
                                    Didn't find any proposals.
                                </div>
                                <div className="text-sm text-isLabelLightSecondary font-500">
                                    Check back later.
                                </div>
                            </div>
                        </React.Fragment>
                    )}

                    {filteredProposals.map((proposal) => (
                        <ProposalPreview
                            proposal={proposal}
                            from="proposals"
                            showIcon={false}
                        />
                    ))}

                    {filteredProposals.length > 0 && (
                        <div
                            style={{
                                color: "darkgray",
                                fontSize: "14px",
                                textAlign: "center",
                            }}
                        >
                            <div style={{ height: "20px" }}></div>
                            Displaying completed proposals for 45 days
                        </div>
                    )}
                </React.Fragment>
            </div>
        </React.Fragment>
    );
};
