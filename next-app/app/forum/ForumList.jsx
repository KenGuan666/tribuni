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
            {protocolForums.map((protocolForum) => (
                <ForumListItem
                    protocolForum={protocolForum}
                    from="tab"
                    showIcon={true}
                />
            ))}
        </div>
    );
};
