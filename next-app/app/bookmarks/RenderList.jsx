"use client";

import React from "react";
import Link from "next/link";
import clsx from "clsx";
import { useState, useEffect, Suspense } from "react";
import { ANIMATE, delay, MAX_WIDTH } from "@/components/constants";
import { MagnifyingGlass, SquareTextSquareFill } from "@/components/ios";
import { Cancel } from "@/components/material-rounded/Cancel";
import { useStore } from "@/store";
import { Spinner } from "@/components/loaders";
import { Hr, Tabs, Title } from "@/components/ui/page";
import { BookmarksList } from "./BookmarksList";
import { Filters } from "@/components/ui/page";
import axios from "axios";
import { useSearchParams } from "next/navigation";

export const getData = async (id) => {
    try {
        const response = await axios.post("/api/v4/bookmarks", { id });
        return response.data;
    } catch (error) {
        console.error(error);
        return [];
    }
};

const RenderListPage = async () => {
    const { user, activeBookmark } = useStore();

    const searchParams = useSearchParams();
    const username = searchParams.get("username");

    const [search, setSearch] = useState("");
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [bookmarks, setBookmarks] = useState([]);
    const [pageLoading, setPageLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setPageLoading(true);
            const data = await getData(username);
            if (data.code !== 200) {
                console.error(data.message);
                setPageLoading(false);
                setBookmarks([]);
                return;
            }
            setBookmarks(data.data);
            setPageLoading(false);
        };

        fetchData();
    }, [activeBookmark]);

    const filteredBookmarks = bookmarks.filter((bookmark) => {
        const isMatch =
            bookmark.title.toLowerCase().startsWith(search.toLowerCase()) ||
            bookmark.proposal_class
                .toLowerCase()
                .startsWith(search.toLowerCase()) ||
            bookmark.protocol.toLowerCase().startsWith(search.toLowerCase());

        return isMatch;
    });

    return pageLoading ? (
        <Spinner classes={clsx("w-5 h-5 border-isBlueLight")} />
    ) : (
        <React.Fragment>
            {activeBookmark === null && <Title text="Bookmarks" />}

            {activeBookmark === null && (
                <div
                    className={clsx(
                        "flex flex-row items-center w-full px-4 shrink-0 pt-3 mb-6",
                        ANIMATE,
                        MAX_WIDTH,
                    )}
                >
                    <div className="flex flex-row items-center w-full py-1 px-2 space-x-1 rounded-xl place-content-center bg-isFillLightTertiary">
                        <MagnifyingGlass
                            classes={clsx(
                                "w-7 h-7 fill-isLabelLightSecondary shrink-0",
                            )}
                        />

                        <input
                            id="search"
                            placeholder="Search"
                            onFocus={() => setIsInputFocused(true)}
                            onBlur={async () => {
                                await delay(10);
                                setIsInputFocused(false);
                            }}
                            onChange={(e) => {
                                setSearch(e.target.value);
                            }}
                            value={search}
                            type="text"
                            className={clsx(
                                "grow bg-transparent outline-none text-lg focus:outline-none font-400 placeholder:text-isLabelLightSecondary text-isLabelLightPrimary leading-none",
                                ANIMATE,
                            )}
                        />

                        {search !== "" && (
                            <button
                                onClick={async () => {
                                    setSearch("");
                                    const div =
                                        document.getElementById("search");

                                    await delay(20);

                                    if (div) {
                                        div.focus();
                                    }
                                }}
                            >
                                <Cancel
                                    classes={clsx(
                                        "w-[1.2rem] h-[1.2rem] fill-isLabelLightSecondary shrink-0",
                                    )}
                                />
                            </button>
                        )}
                    </div>
                </div>
            )}
            <BookmarksList
                arr={filteredBookmarks}
                showIndex={true}
                search={search}
                setPageLoading={setPageLoading}
            />
        </React.Fragment>
    );
};

export const RenderList = () => {
    return (
        <Suspense
            fallback={<Spinner classes={clsx("w-5 h-5 border-isBlueLight")} />}
        >
            <RenderListPage />
        </Suspense>
    );
};
