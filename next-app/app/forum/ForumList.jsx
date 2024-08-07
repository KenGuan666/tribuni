"use client";

import clsx from "clsx";
import React from "react";
import { ANIMATE, MAX_WIDTH } from "@/components/constants";
import { ExclamationmarkSquareFill } from "@/components/ios";
import { ForumListItem } from "./ForumListItem";

export const ForumList = ({ protocolForums }) => {
    return (
        <div
            className={clsx(
                "w-full overflow-y-scroll hide-scrollbar grow mt-2 pb-20 !mb-0 flex flex-col",
                ANIMATE,
                MAX_WIDTH,
            )}
        >
            {/* If there are no available protocols, display some text */}
            {protocolForums.length === 0 && (
                <React.Fragment>
                    <div className="flex flex-col flex-grow items-center mt-8 place-content-center">
                        <ExclamationmarkSquareFill
                            classes={clsx("h-16 w-16 fill-isGrayLight2")}
                        />
                        <div className="w-full text-lg text-center font-600 text-isLabelLightPrimary">
                            No available fora to display
                        </div>
                        <div className="text-sm text-isLabelLightSecondary font-500">
                            See all activities under Home tab
                        </div>
                    </div>
                </React.Fragment>
            )}

            {protocolForums.map((protocolForum) => (
                <ForumListItem
                    protocolForum={protocolForum}
                    from="social"
                    showIcon={true}
                />
            ))}
        </div>
    );
};
