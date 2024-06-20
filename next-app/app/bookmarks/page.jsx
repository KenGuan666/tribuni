"use client";

import React from "react";
import { RenderList } from "./RenderList";
import clsx from "clsx";
import { UserConnector } from "@/components/Connectors";
import { MAX_WIDTH } from "@/components/constants";

export default function Page(req) {
    return (
        <div
            className={clsx(
                "flex flex-col items-center w-full grow overflow-hidden pb-24",
                MAX_WIDTH,
            )}
        >
            <RenderList />
            <UserConnector />
        </div>
    );
}
