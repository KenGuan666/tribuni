import React from "react";
import { ANIMATE, MAX_WIDTH } from "@/components/constants";
import Link from "next/link";
import { useStore } from "@/store";
import clsx from "clsx";
import { Hr } from "@/components/ui/page/Hr";
import { Tag } from "@/components/ui/page/Tag";
import { capitalizeFirstLetter } from "@/utils/text";

export function separateDAO(inputString) {
    const matches = inputString.match(/\bDAO\b/g);

    if (matches) {
        const result = matches.join(" ");
        const leftover = inputString.split(/\bDAO\b/);
        return (leftover.length > 1 ? leftover[1].trim() + " " : "") + result;
    } else {
        return inputString;
    }
}

export const ProtocolList = ({ protocols, showIndex, search }) => {
    const { user, setPageLoading } = useStore();

    return (
        <div
            className={clsx(
                "w-full overflow-y-scroll hide-scrollbar grow mt-2 !mb-0 flex flex-col",
                ANIMATE,
                MAX_WIDTH,
            )}
        >
            {protocols.map((protocol, idx) => {
                // If this is the first protocol, or this procotol's name starts with a different chat from previous
                // render an additional row containing just the initial character, which acts like an index
                const indexChar =
                    idx === 0 ||
                    protocols[idx - 1].name[0].toLowerCase() !==
                        protocols[idx].name[0].toLowerCase()
                        ? protocols[idx].name[0]
                        : null;

                const key = protocol.id;
                const name = protocol.name;

                return (
                    <div id={key} key={key} className="contents">
                        {/* The index row, hidden if search bar is populated */}
                        {showIndex === true &&
                            indexChar !== null &&
                            !search && (
                                <React.Fragment>
                                    <div
                                        className={clsx(
                                            "px-3 pt-4 pb-1 text-base uppercase text-isLabelLightSecondary font-400",
                                        )}
                                    >
                                        {search?.length > 0
                                            ? search[0]
                                            : indexChar}
                                    </div>

                                    <Hr classes={clsx("!px-3")} />
                                </React.Fragment>
                            )}

                        <Link
                            href={`/proposals?protocol=${key}&username=${user.id}&chatid=${user.chatid}`}
                            className="flex flex-row items-center justify-between w-full hover:bg-isSeparatorLight"
                        >
                            <div
                                className={clsx(
                                    "grow py-3 leading-none px-3 text-base",
                                )}
                            >
                                {capitalizeFirstLetter(name).trim()}
                            </div>

                            {/* "active" tag, if applicable */}
                            {protocol.active > 0 && (
                                <Tag
                                    text={`${protocol.active} active`}
                                    bg={clsx("bg-isBlueLight")}
                                />
                            )}

                            {/* "new" tag, if applicable */}
                            {protocol._new > 0 && (
                                <Tag
                                    text={`${protocol._new} new`}
                                    bg={clsx("bg-isGreenLight")}
                                />
                            )}
                        </Link>

                        <Hr classes={clsx("!px-3")} />
                    </div>
                );
            })}
        </div>
    );
};
