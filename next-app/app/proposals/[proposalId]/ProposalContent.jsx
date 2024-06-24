"use client";
import clsx from "clsx";
import React from "react";
import { MAX_WIDTH } from "@/components/constants";
import { saveUserBookmarkUpdates } from "@/components/db/user";
import { BookmarkButton } from "@/components/page/BookmarkButton";
import { Timeline } from "@/components/page/Timeline";
import { VoteNowButton } from "@/components/page/VoteNowButton";
import { VoteResult } from "@/components/page/VoteResult";
import { Hr } from "@/components/ui/page";

export function ProposalContent({ proposalData }) {
    if (!proposalData) {
        return null;
    }
    return (
        <React.Fragment>
            <div
                id="proposalPageRoot"
                className="w-full px-3 pt-1 pb-2 rounded-xl"
            >
                {/* Title */}
                <div className="py-2 mt-2 text-xl tracking-tight leading-tight text-left text-isLabelLightPrimary font-600">
                    {proposalData.title.replace(/"/g, "")}
                </div>

                {/* Timeline visual */}
                <Timeline
                    startTime={proposalData.starttime}
                    endTime={proposalData.endtime}
                />

                {/* Horizontal divider */}
                <hr className="mb-5 rounded-full bg-isSeparatorLight mt-2" />

                {/* Vote result visual */}
                <VoteResult
                    choices={proposalData.choices}
                    results={proposalData.results}
                />

                {/* Horizontal divider */}
                <Hr classes={clsx("!mt-5")} />

                {/* Proposal summary */}
                <div className="uppercase text-isLabelLightSecondary !mt-2 text-base font-500">
                    Proposal Summary
                </div>
                <div className="!mt-2 rounded-xl p-4 text-[15px] text-isLabelLightPrimary bg-isWhite leading-tight relative font-400 break-words remove-all">
                    {proposalData.summary}
                </div>

                {/* Bottom section with bookmark and vote now button */}
                <div
                    className={clsx(
                        "fixed bottom-0 w-full left-1/2 transform -translate-x-1/2 z-10 bg-gray-200 shadow-md",
                        MAX_WIDTH,
                    )}
                >
                    <div className="flex justify-between items-center p-4">
                        <div className="w-full flex flex-row items-center space-x-4 h-12">
                            {/* Bookmark button */}
                            <BookmarkButton
                                proposalId={proposalData.id}
                                userUpdateFn={saveUserBookmarkUpdates}
                            />

                            {/* Vote now button */}
                            <VoteNowButton proposalData={proposalData} />
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}
