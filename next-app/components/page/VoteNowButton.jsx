"use client";
import React from "react";

export const VoteNowButton = ({ userId, proposalData }) => {
    return (
        <a
            href={proposalData.url}
            rel="noopener noreferrer"
            target="_blank"
            className="w-10/12 flex flex-col items-center place-content-center bg-isBlueLight text-lg font-600 text-isWhite rounded-xl h-full"
            onClick={() =>
                window.gtag("event", "vote_now_button_click", {
                    user: userId,
                    protocol: proposalData.protocol,
                    proposal: proposalData.id,
                })
            }
        >
            {proposalData.endtime > new Date() / 1000
                ? "Vote Now"
                : "See Results"}
        </a>
    );
};
