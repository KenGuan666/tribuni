"use client";

import React from "react";
import { ANIMATE, MAX_WIDTH } from "@/components/constants";
import Link from "next/link";
import { useStore } from "@/store";
import Image from "next/image";
import clsx from "clsx";
import { Hr, Tag } from "@/components/ui/page";
import { PROPOSAL_COLORS } from "@/constants/proposalClasses";
import { BookmarkFill, CheckmarkBubbleFill } from "@/components/ios";
import { Bookmark } from "./Bookmark";
import { BASE_USER } from "@/components/constants";
import { useState } from "react";
import { GALogEvent } from "../../lib/GAMetrics";

export function capitalizeFirstLetter(inputString) {
    return inputString.charAt(0).toUpperCase() + inputString.slice(1);
}

const colors = [
    "rgb(0, 199, 190)",
    "rgb(50, 173, 230)",
    "rgb(0, 122, 255)",
    "rgb(88, 86, 214)",
    "rgb(175, 82, 222)",
    "rgb(255, 45, 85)",
    "rgb(162, 132, 94)",
];

const getRandomGradient = () => {
    const gradients = [
        "linear-gradient(45deg, #ff6a00 0%, #ee0979 100%)", // fiery orange to magenta
        "linear-gradient(45deg, #36d1dc 0%, #5b86e5 100%)", // turquoise to blue
        "linear-gradient(45deg, #ff9a9e 0%, #fecfef 100%)", // soft pink to pale rose
        "linear-gradient(45deg, #a1c4fd 0%, #c2e9fb 100%)", // light blue to lighter blue
        "linear-gradient(45deg, #667eea 0%, #764ba2 100%)", // purple to darker purple
        "linear-gradient(45deg, #e0c3fc 0%, #8ec5fc 100%)", // lavender to light blue
        "linear-gradient(45deg, #ffecd2 0%, #fcb69f 100%)", // peach to coral
        "linear-gradient(45deg, #43e97b 0%, #38f9d7 100%)", // green to teal
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
};

function formatTimestamp(timestamp) {
    const currentDate = new Date();
    const targetDate = new Date(timestamp);

    const differenceInMilliseconds = targetDate - currentDate;
    const differenceInSeconds = differenceInMilliseconds / 1000;
    const differenceInMinutes = differenceInSeconds / 60;
    const differenceInHours = differenceInMinutes / 60;
    const differenceInDays = Math.floor(differenceInHours / 24);
    const differenceInMonths = Math.floor(differenceInDays / 30);
    const differenceInYears = Math.floor(differenceInDays / 365);

    if (differenceInYears > 0) {
        return {
            value: differenceInYears,
            unit: "years",
            tense: differenceInMilliseconds >= 0 ? "left" : "ago",
        };
    } else if (differenceInMonths > 0) {
        return {
            value: differenceInMonths,
            unit: "months",
            tense: differenceInMilliseconds >= 0 ? "left" : "ago",
        };
    } else if (differenceInDays > 0) {
        return {
            value: differenceInDays,
            unit: "days",
            tense: differenceInMilliseconds >= 0 ? "left" : "ago",
        };
    } else {
        return {
            value: "0",
            unit: "days",
            tense: "left",
        };
    }
}

export const BookmarksList = ({ arr, showIndex, search, setPageLoading }) => {
    const { user, setUser, activeBookmark, setActiveBookmark } = useStore();

    const [isBookmarked, setIsBookmarked] = useState(true);
    let totalVotes = 0;
    let value, unit, tense;
    if (activeBookmark) {
        totalVotes = 0;
        if (activeBookmark.results && activeBookmark.results.length !== 0) {
            totalVotes = activeBookmark.results.reduce(
                (acc, result) => acc + parseFloat(result.total),
                0,
            );
        }

        ({ value, unit, tense } = formatTimestamp(
            activeBookmark.endtime * 1000,
        ));
    }
    return activeBookmark === null ? (
        <div
            className={clsx(
                "w-full overflow-y-scroll hide-scrollbar grow mt-2 !mb-0 flex flex-col",
                ANIMATE,
                MAX_WIDTH,
            )}
        >
            {arr.map((bookmark, idx) => {
                const key = bookmark.protocol;
                const title = bookmark.title;
                const protocolIcon = bookmark.protocolIcon;
                const date = new Date(bookmark.starttime * 1000);
                const options = {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                };
                const formattedDate = date.toLocaleDateString("en-US", options);
                return (
                    <div id={key} key={key} className="contents">
                        <button
                            onClick={() => {
                                setActiveBookmark(bookmark);
                            }}
                            className="hover:bg-isSeparatorLight"
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                                width: "100%",
                                padding: "10px 0",
                                textAlign: "left",
                            }}
                        >
                            {protocolIcon && protocolIcon.length > 0 ? (
                                <div
                                    style={{
                                        width: 32,
                                        height: 32,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        marginLeft: 8,
                                    }}
                                >
                                    <Image
                                        src={protocolIcon}
                                        alt={title}
                                        width={32}
                                        height={32}
                                        layout="fixed"
                                        style={{
                                            borderRadius: "50%",
                                        }}
                                    />
                                </div>
                            ) : (
                                <div
                                    style={{
                                        width: 32,
                                        height: 32,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        marginLeft: 8,
                                    }}
                                >
                                    <div
                                        style={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: "50%",
                                            background: getRandomGradient(),
                                        }}
                                    />
                                </div>
                            )}
                            <div
                                className={clsx(
                                    "grow py-3 leading-none px-3 text-base",
                                )}
                            >
                                <div
                                    style={{
                                        fontSize: "12px",
                                        color: "darkgray",
                                        marginBottom: "6px",
                                    }}
                                >
                                    {formattedDate}
                                </div>
                                <div
                                    style={{
                                        maxWidth: "200px",
                                        fontSize: "14px",
                                    }}
                                >
                                    {title.length > 50
                                        ? capitalizeFirstLetter(
                                              title.substring(0, 45),
                                          ).trim() + "..."
                                        : capitalizeFirstLetter(title).trim()}
                                </div>
                            </div>
                            <div
                                className={clsx(
                                    "px-[0.4rem] mr-2 py-[0.125rem] rounded-md text-isWhite font-400 tabular-nums",
                                )}
                                style={{
                                    background:
                                        PROPOSAL_COLORS[
                                            bookmark.proposal_class
                                        ],
                                    fontSize: "10px",
                                    textAlign: "center",
                                }}
                            >
                                {bookmark.proposal_class}
                            </div>
                        </button>

                        <Hr classes={clsx("!px-3")} />
                    </div>
                );
            })}
        </div>
    ) : (
        <React.Fragment>
            <button
                onClick={() => {
                    setActiveBookmark(null);
                }}
                style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    width: "100%",
                    padding: "10px 0",
                    textAlign: "left",
                }}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className={clsx(
                        "w-6 h-6 fill-isBlueLight stroke-isBlueLight",
                        ANIMATE,
                    )}
                >
                    <path
                        fillRule="evenodd"
                        d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z"
                        clipRule="evenodd"
                    />
                </svg>

                <div
                    className={clsx(
                        "text-sm text-isBlueLight font-500",
                        ANIMATE,
                    )}
                >
                    Back
                </div>
            </button>
            <div id="" className="w-full px-3 pt-1 pb-2 rounded-xl">
                <div className="z-10 flex flex-row items-center justify-between w-full space-x-1 text-sm font-500 place-content-end">
                    <button
                        className={clsx(
                            "flex flex-row items-center font-500 px-3 py-1 leading-tight rounded-lg bg-isBlueLight text-isLabelDarkPrimary !-ml-1",
                            ANIMATE,
                        )}
                    >
                        {activeBookmark.protocol}
                    </button>
                    <div></div>

                    <button
                        onClick={async () => {
                            console.log("Bookmark clicked");
                            const existingBookmarks = user.bookmarks;
                            let newUser = BASE_USER;
                            if (existingBookmarks.includes(activeBookmark.id)) {
                                // If proposal is already in bookmarks, remove it
                                newUser = {
                                    ...user,
                                    bookmarks: existingBookmarks.filter(
                                        (item) => item !== activeBookmark.id,
                                    ),
                                };
                                setIsBookmarked(false);
                            } else {
                                // If proposal is not in bookmarks, add it
                                newUser = {
                                    ...user,
                                    bookmarks: [
                                        ...existingBookmarks,
                                        activeBookmark.id,
                                    ],
                                };
                                setIsBookmarked(true);
                            }

                            setUser(newUser);

                            await Bookmark({
                                username: user.id,
                                proposal: activeBookmark.id,
                            });
                        }}
                        className={clsx(
                            "flex flex-row items-center px-3  py-1 leading-tight rounded-lg text-isLabelDarkPrimary !-mr-1",
                            ANIMATE,
                            isBookmarked
                                ? "bg-isGreenLight"
                                : "bg-isOrangeLight",
                        )}
                    >
                        <div className="font-500">
                            {isBookmarked ? "Bookmarked" : "Bookmark"}
                        </div>
                        {isBookmarked ? (
                            <CheckmarkBubbleFill
                                classes={clsx(
                                    "h-5 w-5 ml-[0.2rem] -mr-1 fill-isLabelDarkPrimary",
                                )}
                            />
                        ) : (
                            <BookmarkFill
                                classes={clsx(
                                    "h-5 w-5 -mr-1 fill-isLabelDarkPrimary",
                                )}
                            />
                        )}
                    </button>
                </div>

                <div className="py-2 mt-2 text-xl tracking-tight leading-tight text-left text-isLabelLightPrimary font-600">
                    {activeBookmark.title.replace(/"/g, "")}
                </div>

                <hr className="mb-5 rounded-full bg-isSeparatorLight mt-2" />

                <div className="w-full flex flex-row items-center space-x-4 h-12">
                    <div className="w-5/12 flex justify-evenly flex-row items-center place-content-center bg-isWhite text-isLabelLightPrimary rounded-xl h-full">
                        <div className="w-fit flex flex-col items-end place-content-center text-3xl shrink-0 font-700 text-isSystemDarkTertiary">
                            {value}
                        </div>
                        <div className="flex flex-col items-start w-fit text-isLabelLightSecondary leading-tight font-500">
                            <div>{unit}</div>
                            <div>{tense}</div>
                        </div>
                    </div>

                    {activeBookmark.url &&
                        activeBookmark.url !== null &&
                        activeBookmark.url !== "undefined" && (
                            <a
                                href={activeBookmark.url}
                                rel="noopener noreferrer"
                                target="_blank"
                                className="w-7/12 flex flex-col items-center place-content-center bg-isBlueLight text-lg font-600 text-isWhite rounded-xl h-full"
                                onClick={() =>
                                    GALogEvent({
                                        action: "CLICK BUTTON",
                                        label: "Vote Now",
                                        username: user.id,
                                        protocol_id: activeBookmark.protocol,
                                        proposal_id: activeBookmark.id,
                                    })
                                }
                            >
                                {activeBookmark.endtime > new Date() / 1000
                                    ? "Vote Now"
                                    : "See Results"}
                            </a>
                        )}
                </div>

                {activeBookmark.results &&
                    activeBookmark.results.length !== 0 && (
                        <div className="w-full h-fit mt-5">
                            <div className="flex flex-col items-center w-full bg-isWhite p-4 rounded-xl">
                                <div className="w-full">
                                    <div className="flex flex-col items-center w-full text-xs capitalize rounded-lg bg-isWhite text-isLabelLightSecondary font-400">
                                        {activeBookmark.choices.map(
                                            (choice, idx) => {
                                                const idxStr = idx.toString();
                                                let votesForThisChoice = 0,
                                                    percent = 0;
                                                activeBookmark.results.forEach(
                                                    (entry) => {
                                                        if (
                                                            entry.choice ==
                                                            idxStr
                                                        ) {
                                                            votesForThisChoice =
                                                                entry.total;
                                                            percent = (
                                                                (parseFloat(
                                                                    votesForThisChoice,
                                                                ) /
                                                                    totalVotes) *
                                                                100
                                                            ).toFixed(2);
                                                        }
                                                    },
                                                );
                                                // Format total votes
                                                const formattedVotes =
                                                    new Intl.NumberFormat(
                                                        "en",
                                                        {
                                                            notation: "compact",
                                                            compactDisplay:
                                                                "short",
                                                            maximumFractionDigits: 1,
                                                        },
                                                    ).format(
                                                        votesForThisChoice,
                                                    );

                                                const colorIndex =
                                                    idx % colors.length;
                                                return (
                                                    <React.Fragment key={idx}>
                                                        {idx !== 0 && (
                                                            <div className="mb-3" />
                                                        )}

                                                        <div className="w-full space-x-2">
                                                            <div className="relative h-3 bg-isSystemLightSecondary rounded-2xl overflow-hidden">
                                                                <div
                                                                    className="absolute top-0 h-3 rounded-2xl"
                                                                    style={{
                                                                        width: `${percent}%`,
                                                                        backgroundColor:
                                                                            colors[
                                                                                colorIndex
                                                                            ],
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-row items-center justify-between w-full mt-1">
                                                            <div className="flex flex-row items-center">
                                                                <div className="truncate text-ellipsis max-w-[7rem]">
                                                                    {choice}
                                                                </div>{" "}
                                                                <div>
                                                                    , {percent}%
                                                                </div>
                                                            </div>
                                                            <div className="ml-auto">
                                                                {formattedVotes}{" "}
                                                                votes
                                                            </div>
                                                        </div>
                                                    </React.Fragment>
                                                );
                                            },
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                <Hr classes={clsx("!mt-5")} />

                <div className="uppercase text-isLabelLightSecondary !mt-2 text-base font-500">
                    Proposal Summary
                </div>

                <div className="!mt-2 rounded-xl p-4 text-[15px] text-isLabelLightPrimary bg-isWhite leading-tight relative font-400 break-words remove-all">
                    {activeBookmark.summary}
                </div>
            </div>
        </React.Fragment>
    );
};
