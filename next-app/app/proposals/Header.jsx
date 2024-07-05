"use client";

import React from "react";
import { Spinner } from "@/components/loaders";
import { ProtocolIcon } from "@/components/page/ProtocolIcon";

export const Header = ({ protocolInfo }) => {
    if (!protocolInfo) {
        // Render a spinner until all data loaded
        if (!proposalsData || user == BASE_USER) {
            return <Spinner />;
        }
    }

    return (
        <React.Fragment>
            <div className="contents">
                <div className="flex flex-col items-center w-full my-2 space-y-2">
                    <div className="relative w-[4.5rem] h-[4.5rem] overflow-hidden rounded-full">
                        <div className="absolute w-full h-full bg-gradient-to-br from-isWhite to-isSystemLightTertiary animate-pulse" />
                        <ProtocolIcon protocol={protocolInfo} fill={true} />
                    </div>

                    <div className="inline-block w-full text-xl text-center font-600 text-isLabelLightPrimary">
                        {protocolInfo.name}
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};
