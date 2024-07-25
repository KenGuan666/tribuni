"use client";

import clsx from "clsx";
import { useRouter } from "next/navigation";
import { Hr } from "@/components/ui/page";
import { PROPOSAL_COLORS } from "@/constants/proposalClasses";
import { useStore } from "@/store";
import { relativeTimeLabel } from "@/utils/time";
import { capitalizeFirstLetter } from "@/utils/text";
import { ProtocolIcon } from "@/components/page/ProtocolIcon";

export const ForumListItem = ({ protocolForum, from, showIcon }) => {
    const { user, getCachedProtocol } = useStore();
    const router = useRouter();

    const protocolId = protocolForum.protocol;
    const title = protocolForum.name;

    const horizontalMargin = showIcon ? 56 : 24;
    return (
        <div id={protocolId} key={protocolId} className="contents">
            <button
                className="hover:bg-isSeparatorLight"
                onClick={() => {
                    router.push(
                        `${process.env.NEXT_PUBLIC_SERVER_URL}/forum/${protocolForum.id}?username=${user.id}&chatid=${user.chatid}&from=${from}`,
                    );
                }}
                style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    width: "100%",
                    padding: "6px 0",
                    textAlign: "left",
                }}
            >
                {showIcon && (
                    <div
                        style={{
                            width: 32,
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginLeft: "12px",
                            alignSelf: "center",
                        }}
                    >
                        <ProtocolIcon protocol={protocolForum} size={32} />
                    </div>
                )}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        width: `calc(100% - ${horizontalMargin}px)`,
                        marginLeft: "12px",
                        padding: "8px 0",
                        marginRight: "6px",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <div
                            style={{
                                fontSize: showIcon ? "14px" : "16px",
                                color: "darkgray",
                            }}
                        >
                            {protocolForum.forumNumNewPosts} new posts this week
                        </div>
                        <div
                            className={clsx(
                                "px-[0.6rem] mr-2 py-[0.125rem] font-400 tabular-nums",
                            )}
                            style={{
                                background: `${
                                    PROPOSAL_COLORS[
                                        protocolForum.protocolForum_class
                                    ]
                                }1A`,
                                fontSize: "12px",
                                color: PROPOSAL_COLORS[
                                    protocolForum.protocolForum_class
                                ],
                                textAlign: "center",
                                borderRadius: "20px",
                            }}
                        >
                            {protocolForum.protocolForum_class}
                        </div>
                    </div>
                    <div
                        style={{
                            maxWidth: "250px",
                            fontSize: "16px",
                            lineHeight: "1.2",
                            marginTop: "4px",
                        }}
                    >
                        {title.length > 64
                            ? capitalizeFirstLetter(
                                  title.substring(0, 64),
                              ).trim() + "..."
                            : capitalizeFirstLetter(title).trim()}
                    </div>
                </div>
            </button>

            <Hr classes={clsx("!px-3")} useDarkColor={true} />
        </div>
    );
};
