"use client";

import React from "react";
import clsx from "clsx";
import { MAX_WIDTH } from "@/components/constants";
import { useStore } from "@/store";
import { saveUserSubscriptionUpdates } from "@/components/db/user";
import { Hr } from "@/components/ui/page";

export const SubscriptionSwitch = ({ protocolId }) => {
    const { user, setUser } = useStore();
    const isSubscribed = user.subscriptions.includes(protocolId);

    return (
        <React.Fragment>
            <div
                className={clsx(
                    "flex flex-row items-center justify-between w-full px-4 py-2 rounded-xl bg-isWhite mt-4",
                    MAX_WIDTH,
                )}
            >
                <div className="text-base text-isLabelLightPrimary font-400">
                    Subscribe
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        onChange={async () => {
                            if (isSubscribed) {
                                // If protocol is already in subscriptions, remove it
                                user.subscriptions = user.subscriptions.filter(
                                    (item) => item !== protocolId,
                                );
                            } else {
                                // If protocol is not in subscriptions, add it
                                user.subscriptions.push(protocolId);
                            }

                            setUser(newUser);
                            saveUserSubscriptionUpdates(user);
                        }}
                        type="checkbox"
                        checked={isSubscribed}
                        className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-isGreenLight"></div>
                </label>
            </div>
            <div className="w-full"></div>
            <Hr classes={clsx("my-3 !px-0")} />
        </React.Fragment>
    );
};
