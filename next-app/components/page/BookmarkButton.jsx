"use client";
import React from "react";

/*
BookmarkButton: on click, bookmarks or unbookmarks current proposal for user
*/
export const BookmarkButton = ({ user, proposalId, userUpdateFn }) => {
    const isBookmarked = user.bookmarks.includes(proposalId);

    return (
        <button
            className={`w-12 h-full flex items-center justify-center rounded-xl ${isBookmarked ? "bg-[#F29100]" : "bg-gray-300"} `}
            onClick={async () => {
                if (isBookmarked) {
                    // If proposal is already in bookmarks, remove it
                    user.bookmarks = user.bookmarks.filter(
                        (item) => item !== proposalId,
                    );
                } else {
                    // If proposal is not in bookmarks, add it
                    user.bookmarks.push(proposalId);
                }
                await userUpdateFn(user);
            }}
        >
            {/* The bookmark icon from w3.org */}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke={isBookmarked ? "#fff" : "#124de4"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-bookmark"
            >
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
        </button>
    );
};
