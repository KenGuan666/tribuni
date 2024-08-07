"use client";

import React from "react";
import { clsx } from "clsx";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useStore } from "@/store";
import { BASE_USER, MAX_WIDTH } from "../constants";
import { NavBookmarks, NavHome, NavSettings } from "../ios";
import { OpIcon } from "./OpIcon";

export const UserConnector = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { user } = useStore();

    if (user == BASE_USER) {
        return null;
    }

    return (
        <React.Fragment>
            {user.id !== null && (
                <div
                    className={clsx(
                        "h-16 w-full bg-[#F9F9F9] fixed bottom-0 grid grid-cols-4 items-center place-content-center",
                        MAX_WIDTH,
                    )}
                >
                    {[
                        {
                            key: "Home",
                            icon: NavHome,
                            path: "/protocols",
                        },
                        {
                            key: "Bookmarks",
                            icon: NavBookmarks,
                            path: "/bookmarks",
                        },
                        {
                            key: "OP Forum",
                            icon: OpIcon,
                            path: "/forum/1",
                        },
                        {
                            key: "Settings",
                            icon: NavSettings,
                            path: "/settings",
                        },
                    ].map((ele, idx) => {
                        return (
                            <div
                                key={ele.key}
                                className="col-span-1 items-center flex flex-col place-content-center w-full h-full"
                            >
                                <button
                                    onClick={() => {
                                        // setPageLoading(true);
                                        router.push(
                                            `${ele.path}?username=${user.id}&chatid=${user.chatid}`,
                                        );
                                    }}
                                    href={`${ele.path}?username=${user.id}&chatid=${user.chatid}`}
                                    className="w-fit h-fit flex flex-col items-center"
                                >
                                    <ele.icon
                                        classes={clsx(
                                            "h-5 w-6",
                                            pathname === ele.path
                                                ? "fill-isBlueLight"
                                                : "fill-isLabelLightSecondary",
                                        )}
                                    />

                                    <div
                                        className={clsx(
                                            "text-xs capitalize font-500",
                                            pathname === ele.path
                                                ? "text-isBlueLight"
                                                : "text-isLabelLightSecondary",
                                        )}
                                    >
                                        {ele.key}
                                    </div>
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </React.Fragment>
    );
};
