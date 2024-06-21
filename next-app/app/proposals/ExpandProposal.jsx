'use client';

import React from "react";
import Link from "next/link";
import clsx from "clsx";
import { ANIMATE } from "@/components/constants";
import { useStore } from "@/store";
import { BookmarkFill, CheckmarkBubbleFill } from "@/components/ios";
import { sendGAEvent } from '@next/third-parties/google'

import { Bookmark } from "./Bookmark";
import { BASE_USER } from "@/components/constants";
import { Hr } from "@/components/ui/page";
import { TimelineDisplay } from "@/components/page/TimelineDisplay"

export const ExpandProposal = ({ proposalMap, protocol }) => {
  const { activeProposal, user, setUser } = useStore();
  let totalVotes = 0;

  const isBookmarked = user.bookmarks.includes(activeProposal);

  if (
    proposalMap[activeProposal].results &&
    proposalMap[activeProposal].results.length !== 0
  ) {
    totalVotes = proposalMap[activeProposal].results.reduce(
      (acc, result) => acc + parseFloat(result?.total ?? 0),
      0
    );
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

  return (
    <React.Fragment>
      <div id="" className="w-full px-3 pt-1 pb-2 rounded-xl">
        {/* Title */}
        <div className="py-2 mt-2 text-xl tracking-tight leading-tight text-left text-isLabelLightPrimary font-600">
          {proposalMap[activeProposal].title.replace(/"/g, "")}
        </div>

        {/* Timeline visual */}
        <TimelineDisplay startTime={proposalMap[activeProposal].starttime} endTime={proposalMap[activeProposal].endtime} />

        <hr className="mb-5 rounded-full bg-isSeparatorLight mt-2" />

        {/* Live vote result, if available */}
        {proposalMap[activeProposal].results &&
          proposalMap[activeProposal].results.length !== 0 && (
            <div className="w-full h-fit mt-5">
              <div className="flex flex-col items-center w-full bg-isWhite p-4 rounded-xl">
                <div className="w-full">
                  <div className="flex flex-col items-center w-full text-xs capitalize rounded-lg bg-isWhite text-isLabelLightSecondary font-400">
                    {
                      proposalMap[activeProposal].choices.map((choice, idx) => {
                        const idxStr = idx.toString()
                        let votesForThisChoice = 0, percent = 0
                        proposalMap[activeProposal].results.forEach((entry) => {
                          if (entry && entry.choice == idxStr) {
                            votesForThisChoice = entry.total
                            percent = ((parseFloat(votesForThisChoice) / totalVotes) * 100).toFixed(2);
                          }
                        })
                        // Format total votes
                        const formattedVotes = new Intl.NumberFormat("en", {
                          notation: "compact",
                          compactDisplay: "short",
                          maximumFractionDigits: 1,
                        }).format(votesForThisChoice);

                        const colorIndex = idx % colors.length;
                        return (
                          <React.Fragment key={idx}>
                            {idx !== 0 && <div className="mb-3" />}

                            <div className="w-full space-x-2">
                              <div className="relative h-3 bg-isSystemLightSecondary rounded-2xl overflow-hidden">
                                <div
                                  className="absolute top-0 h-3 rounded-2xl"
                                  style={{
                                    width: `${percent}%`,
                                    backgroundColor: colors[colorIndex],
                                  }}
                                />
                              </div>
                            </div>

                            <div className="flex flex-row items-center justify-between w-full mt-1">
                              <div className="flex flex-row items-center">
                                <div className="truncate text-ellipsis max-w-[7rem]">
                                  {choice}
                                </div>{" "}
                                <div>, {percent}%</div>
                              </div>
                              <div className="ml-auto">
                                {formattedVotes} votes
                              </div>
                            </div>
                          </React.Fragment>
                        );
                      })
                    }
                  </div>
                </div>
              </div>
            </div>
          )}
        <Hr classes={clsx("!mt-5")} />

        <div className="uppercase text-isLabelLightSecondary !mt-2 text-base font-500">
          Proposal Summary
        </div>

        {/* Summary */}
        <div className="!mt-2 rounded-xl p-4 text-[15px] text-isLabelLightPrimary bg-isWhite leading-tight relative font-400 break-words remove-all">
          {/* <Markdown remarkPlugins={[remarkGfm]}> */}
          {/* {proposalMap[activeProposal].summary.slice(0, 600)}
          {proposalMap[activeProposal].summary.length >= 501 && "..."} */}
          {proposalMap[activeProposal].summary}
          {/* </Markdown> */}
        </div>

        {/* Bottom section */}
        <div className="fixed bottom-0 left-0 w-full z-10 bg-gray-200 shadow-md">
          <div className="flex justify-between items-center p-4">
            <div className="w-full flex flex-row items-center space-x-4 h-12">
              {/* Bookmark button */}
              <button
                onClick={async () => {
                  const existingBookmarks = user.bookmarks;
                  let newUser = BASE_USER;
                  if (existingBookmarks.includes(activeProposal)) {
                    // If proposal is already in bookmarks, remove it
                    newUser = {
                      ...user,
                      bookmarks: existingBookmarks.filter(
                        (item) => item !== activeProposal
                      ),
                    };
                  } else {
                    // If proposal is not in bookmarks, add it
                    newUser = {
                      ...user,
                      bookmarks: [...existingBookmarks, activeProposal],
                    };
                  }

                  setUser(newUser);

                  await Bookmark({
                    username: user.id,
                    proposal: activeProposal,
                  });
                }}
                className={`w-12 h-full flex items-center justify-center rounded-xl ${isBookmarked ? 'bg-[#F29100]' : 'bg-gray-300'} `}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={isBookmarked ? '#fff' : '#124de4'}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-bookmark"
                >
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
              </button>

              {/* Vote now button */}
              {proposalMap[activeProposal].url &&
                proposalMap[activeProposal].url !== null &&
                proposalMap[activeProposal].url !== "undefined" && (
                  <a
                    href={proposalMap[activeProposal].url}
                    rel="noopener noreferrer"
                    target="_blank"
                    className="w-10/12 flex flex-col items-center place-content-center bg-isBlueLight text-lg font-600 text-isWhite rounded-xl h-full"
                    onClick={() => window.gtag('event', 'vote_now_button_click', {
                      user: user.id,
                      protocol: protocol,
                      proposal: proposalMap[activeProposal].id,
                    })}
                  >
                    {proposalMap[activeProposal].endtime > new Date() / 1000 ? "Vote Now" : "See Results"}
                  </a>
                )}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
