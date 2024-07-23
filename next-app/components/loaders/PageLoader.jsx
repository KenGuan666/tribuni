"use client";

import React from "react";
import Head from "next/head";
import { useStore } from "@/store";
import { useEffect } from "react";
import { Spinner } from "./Spinner";
import clsx from "clsx";

export const PageLoader = ({ children, title }) => {
    const { pageLoading, setPageLoading } = useStore();

    useEffect(() => {
        setPageLoading(false);
    }, [pageLoading]);

    if (pageLoading === false) {
        return (
            <React.Fragment>
                {/* {If a title is provided, set page title} */}
                {title && (
                    <Head>
                        <title>{title}</title>
                    </Head>
                )}
                {children}
            </React.Fragment>
        );
    } else {
        return (
            <div className="flex flex-col items-center w-full p-4 place-content-center">
                <Spinner />
            </div>
        );
    }
};
