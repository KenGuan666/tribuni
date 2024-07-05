"use client";

import clsx from "clsx";
import { useRouter } from "next/navigation";
import { ANIMATE, MAX_WIDTH } from "@/components/constants";
import { Hr } from "@/components/ui/page";
import { PROPOSAL_COLORS } from "@/constants/proposalClasses";
import { useStore } from "@/store";
import { relativeTimeLabel } from "@/utils/time";
import { capitalizeFirstLetter } from "@/utils/text";
import { ProtocolIcon } from "@/components/page/ProtocolIcon";

export const ProposalList = ({ proposals }) => {
    const { user, getCachedProtocol } = useStore();
    const router = useRouter();

    return (
        <div
            className={clsx(
                "w-full overflow-y-scroll hide-scrollbar grow mt-2 !mb-0 flex flex-col",
                ANIMATE,
                MAX_WIDTH,
            )}
        >
            {proposals.map((proposal) => {
                const protocolId = proposal.protocol;
                const protocol = getCachedProtocol(protocolId);
                const title = proposal.title;
                const date = new Date(proposal.endtime);
                const formattedDate = relativeTimeLabel(date);
                return (
                    <div id={protocolId} key={protocolId} className="contents">
                        <button
                            className="hover:bg-isSeparatorLight"
                            onClick={() => {
                                router.push(
                                    `${process.env.NEXT_PUBLIC_SERVER_URL}/proposals/${proposal.id}?username=${user.id}&chatid=${user.chatid}&from=bookmarks`,
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
                                <ProtocolIcon protocol={protocol} size={32} />
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    width: "calc(100% - 56px)",
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
                                            fontSize: "12px",
                                            color: "darkgray",
                                        }}
                                    >
                                        {formattedDate}
                                    </div>
                                    <div
                                        className={clsx(
                                            "px-[0.6rem] mr-2 py-[0.125rem] font-400 tabular-nums",
                                        )}
                                        style={{
                                            background: `${
                                                PROPOSAL_COLORS[
                                                    proposal.proposal_class
                                                ]
                                            }1A`,
                                            fontSize: "10px",
                                            color: PROPOSAL_COLORS[
                                                proposal.proposal_class
                                            ],
                                            textAlign: "center",
                                            borderRadius: "20px",
                                        }}
                                    >
                                        {proposal.proposal_class}
                                    </div>
                                </div>
                                <div
                                    style={{
                                        maxWidth: "250px",
                                        fontSize: "14px",
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

                        <Hr classes={clsx("!px-3")} />
                    </div>
                );
            })}
        </div>
    );
};
