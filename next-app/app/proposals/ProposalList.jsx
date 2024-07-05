"use client";

import clsx from "clsx";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { ANIMATE, MAX_WIDTH } from "@/components/constants";
import { Spinner } from "@/components/loaders";
import { ChevronForward, ExclamationmarkSquareFill } from "@/components/ios";
import { Tabs } from "@/components/ui/page";
import { useStore } from "@/store";

function timeFromNow(timestamp) {
    const currentDate = new Date();
    const targetDate = new Date(timestamp * 1000); // Convert seconds to milliseconds

    const timeDifference = targetDate - currentDate;

    const seconds = Math.abs(Math.floor(timeDifference / 1000));
    const minutes = Math.abs(Math.floor(seconds / 60));
    const hours = Math.abs(Math.floor(minutes / 60));
    const days = Math.abs(Math.floor(hours / 24));
    const weeks = Math.abs(Math.floor(days / 7));
    const months = Math.abs(Math.floor(days / 30));
    const years = Math.abs(Math.floor(days / 365));

    if (timeDifference < 0) {
        // Past timestamp
        if (years > 0) return `${years}y ago`;
        if (months > 0) return `${months}mo ago`;
        if (weeks > 0) return `${weeks}w ago`;
        if (days > 0) return `${days}d ago`;
        if (hours > 0) return `${hours}h ago`;
        if (minutes > 0) return `${minutes}min ago`;

        return `${seconds}s ago`;
    } else {
        // Future timestamp
        if (years > 0) return `in ${years}y`;
        if (months > 0) return `in ${months}mo`;
        if (weeks > 0) return `in ${weeks}w`;
        if (days > 0) return `in ${days}d`;
        if (hours > 0) return `in ${hours}h`;
        if (minutes > 0) return `in ${minutes}min`;

        return `in ${seconds}s`;
    }
}

// Example usage:
// const futureTimestamp = 1698954087 + 3600; // Adding 1 hour to the previous example
// console.log(timeFromNow(futureTimestamp));

export const ProposalList = ({ proposalMap, protocol }) => {
    if (!proposalMap) {
        return <Spinner />;
    }

    const [filter, setFilter] = useState("all");
    const { user, setPageLoading } = useStore();
    const router = useRouter();

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
        const currentTime = Math.floor(Date.now() / 1000);
        const timeDifference = proposal.endtime - currentTime;

        if (filter === "all") {
            return true; // Keep all proposals
        } else if (filter === "active") {
            return timeDifference > 0; // Keep proposals with endtime in the future
        } else if (filter === "closed") {
            return timeDifference < 0; // Keep proposals with endtime in the past
        }

        return false; // Default to false if 'filter' has an unrecognized value
    });

    return (
        <React.Fragment>
            <Tabs
                list={["all", "active", "closed"]}
                setter={setFilter}
                active={filter}
                classes={clsx("!pt-0 !px-0 !max-w-none mt-1")}
            />

            <div
                id="proposal-detail"
                className={clsx(
                    "w-full overflow-y-auto grow !space-y-2 text-md hide-scrollbar rounded-xl mt-5 pb-20",
                    ANIMATE,
                    MAX_WIDTH,
                )}
            >
                {/* Display a list of clickable proposal previews */}
                <React.Fragment>
                    {filteredProposals.map((proposal) => {
                        return (
                            <button
                                key={proposal.id}
                                // Generate a proposal page view event
                                onClick={() => {
                                    window.gtag(
                                        "event",
                                        "view_proposal_button_click",
                                        {
                                            user: user.id,
                                            protocol: protocol,
                                            proposal: proposal.id,
                                        },
                                    );
                                    // setPageLoading(true);
                                    router.push(
                                        `${process.env.NEXT_PUBLIC_SERVER_URL}/proposals/${proposal.id}?username=${user.id}&chatid=${user.chatid}`,
                                    );
                                }}
                                className="w-full hover:bg-isSystemLightTertiary bg-isWhite rounded-2xl !mt-0 p-4 flex flex-row"
                            >
                                <div className="flex flex-col grow w-[calc(100%-3rem)]">
                                    <div className="w-full flex flex-row items-center space-x-1 font-400 text-base">
                                        <div className="tracking-tight rounded-md w-fit text-isLabelLightSecondary ">
                                            {timeFromNow(proposal.endtime)}
                                        </div>
                                    </div>

                                    <div
                                        className={clsx(
                                            "w-full text-isLabelLightPrimary font-400 text-left truncate text-ellipsis text-base",
                                            ANIMATE,
                                        )}
                                    >
                                        {proposal.title.replace(/"/g, "")}
                                    </div>
                                </div>

                                <div className="shrink-0 ml-5 w-5 self-center">
                                    <ChevronForward
                                        classes={clsx(
                                            "w-5 h-5 fill-isLabelLightSecondary",
                                        )}
                                    />
                                </div>
                            </button>
                        );
                    })}

                    {/* If there's no proposal under current filter */}
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
                </React.Fragment>
            </div>
        </React.Fragment>
    );
};
