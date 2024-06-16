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

  const startDiff =
    Math.floor(Date.now() / 1000) - proposalMap[activeProposal].starttime;
  const diff =
    proposalMap[activeProposal].endtime - Math.floor(Date.now() / 1000);

  const utcTimestamps = {
    starttime: proposalMap[activeProposal].starttime * 1000,
    endtime: proposalMap[activeProposal].endtime * 1000,
  };

  const localDates = {
    startDate: new Date(utcTimestamps.starttime),
    endDate: new Date(utcTimestamps.endtime),
  };

  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const localTimes = {
    start: localDates.startDate.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      timeZone: userTimeZone,
    }),
    end: localDates.endDate.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      timeZone: userTimeZone,
    }),
  };

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

  const { value, unit, tense } = formatTimestamp(
    proposalMap[activeProposal].endtime * 1000
  );

  return (
    <React.Fragment>
      <div id="" className="w-full px-3 pt-1 pb-2 rounded-xl">
        <div className="py-2 mt-2 text-xl tracking-tight leading-tight text-left text-isLabelLightPrimary font-600">
          {proposalMap[activeProposal].title.replace(/"/g, "")}
        </div>

        <TimelineDisplay startTime={proposalMap[activeProposal].starttime} endTime={proposalMap[activeProposal].endtime} timeLeft={`${value} ${unit} ${tense}`}/>

        <hr className="mb-5 rounded-full bg-isSeparatorLight mt-2" />

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

        <div className="!mt-2 rounded-xl p-4 text-[15px] text-isLabelLightPrimary bg-isWhite leading-tight relative font-400 break-words remove-all">
          {/* <Markdown remarkPlugins={[remarkGfm]}> */}
          {/* {proposalMap[activeProposal].summary.slice(0, 600)}
          {proposalMap[activeProposal].summary.length >= 501 && "..."} */}
          {proposalMap[activeProposal].summary}
          {/* </Markdown> */}
        </div>

        <div className="fixed bottom-0 left-0 w-full z-10 bg-gray-200 shadow-md">
          <div className="flex justify-between items-center p-4">
            <div className="w-full flex flex-row items-center space-x-4 h-12">
              {/* The "x days left" display, removed from most recent designs  */}
              {/* <div className="w-5/12 flex justify-evenly flex-row items-center place-content-center bg-isWhite text-isLabelLightPrimary rounded-xl h-full">
                <div className="w-fit flex flex-col items-end place-content-center text-3xl shrink-0 font-700 text-isSystemDarkTertiary">
                  {value}
                </div>
                <div className="flex flex-col items-start w-fit text-isLabelLightSecondary leading-tight font-500">
                  <div>{unit}</div>
                  <div>{tense}</div>
                </div>
              </div> */}

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

              {proposalMap[activeProposal].url &&
                proposalMap[activeProposal].url !== null &&
                proposalMap[activeProposal].url !== "undefined" && (
                  <a
                    href={proposalMap[activeProposal].url}
                    rel="noopener noreferrer"
                    target="_blank"
                    className="w-10/12 flex flex-col items-center place-content-center bg-isBlueLight text-lg font-600 text-isWhite rounded-xl h-full"
                    onClick={() => sendGAEvent({
                      event: 'vote_now_button_click',
                      value: `{user: ${user.id}, protocol: ${protocol}, proposal: ${proposalMap[activeProposal].id}`,
                    })}
                  >
                    {proposalMap[activeProposal].endtime > new Date() / 1000 ? "Vote Now" : "See Results"}
                  </a>
                )}
            </div>
          </div>
        </div>

        {/* <hr className="my-2 bg-isSeparatorLight" />
							-- <b>Stats</b> (Coming Soon) */}
        {/* <article className="prose break-all lg:prose-xl">
								-- {proposalMap[activeProposal].content}
							</article> */}
      </div>
    </React.Fragment>
  );
};
