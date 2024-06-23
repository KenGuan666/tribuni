"use server";
import clsx from "clsx";
import React from "react";
import { ANIMATE, MAX_WIDTH } from "@/components/constants";
import { sql } from "@/components/db";
import { PageLoader } from "@/components/loaders";
import { BookmarkButton } from "@/components/page/BookmarkButton";
import { Timeline } from "@/components/page/Timeline";
import { VoteResult } from "@/components/page/VoteResult";
import { useStore } from "@/store";
import { VoteNowButton } from "@/components/page/VoteNowButton";

export default async function Page({ params, searchParams }) {
    const { proposalId } = params;
    const { username, chatid, routeSource } = searchParams;
    var proposalData, user;
    try {
        proposalData = await fetchProposalData(proposalId);
    } catch (err) {
        // If db is unavailable, display an error message
        // TODO: set up client side error logging
        return clientErrorMessageElement(`503 Service Unavailable: ${err}`);
    }

    try {
        user = await fetchUserData(username, chatid);
    } catch (err) {
        return clientErrorMessageElement(`503 Service Unavailable: ${err}`);
    }

    return (
        <PageLoader
            children={
                // Set screen width to be consistent with other pages
                <div
                    className={clsx(
                        "flex flex-col w-full p-4 grow bg-isSystemLightSecondary overflow-hidden",
                        MAX_WIDTH,
                    )}
                >
                    {/* Make the page scrollable */}
                    <div
                        id="proposal-detail"
                        className={clsx(
                            "w-full overflow-y-auto grow !space-y-2 text-md hide-scrollbar rounded-xl mt-5 pb-20",
                            ANIMATE,
                            MAX_WIDTH,
                            "mt-3",
                        )}
                    >
                        <ProposalDisplay
                            proposalData={proposalData}
                            user={user}
                        />
                    </div>
                </div>
            }
        />
    );
}

async function ProposalDisplay({ proposalData, user }) {
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
                                user={user}
                                proposalId={proposalData.id}
                                userUpdateFn={saveUserBookmarkUpdates}
                            />

                            {/* Vote now button */}
                            <VoteNowButton
                                userId={user.id}
                                proposalData={proposalData}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

async function fetchProposalData(proposalId) {
    // TODO: This function should first attempt to read proposalData from a cache
    // such that it doesn't repeatedly query the db in the same session

    // retrieve proposal data from DB
    const proposalQuery = `
        SELECT *
        FROM proposals
        WHERE id = '${proposalId}'
        LIMIT 1;
    `;
    return (await sql.unsafe(proposalQuery))[0];
}

async function fetchUserData(username, chatid) {
    const userQuery = `
        SELECT *
        FROM telegram_users
        WHERE id = '${username}' AND chatid = '${chatid}'
        LIMIT 1;
    `;
    return (await sql.unsafe(userQuery))[0];
}

async function saveUserBookmarkUpdates(user) {
    "use server";
    // first, update user in database
    const updateUserQuery = `
    UPDATE telegram_users
    SET bookmarks = ${sql.array(user.bookmarks, "text")}
    WHERE id = ${user.id};
    `;
    await sql.unsafe(updateUserQuery);

    // then, update user in frontend state
    const { setUser } = useStore();
    setUser(user);
}

function clientErrorMessageElement(message) {
    return (
        <div>
            {`${message} If you see this in Tribuni Telegram bot, please reach Tribuni team for help.`}
        </div>
    );
}
