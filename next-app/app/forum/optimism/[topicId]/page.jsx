"use client";
import clsx from "clsx";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ANIMATE, MAX_WIDTH } from "@/components/constants";
import { fetchForumById } from "@/components/db/forum";
import {
    fetchOPTopicById,
    fetchOPPostsByTopicId,
} from "@/components/db/op_forum";
import { Hr } from "@/components/ui/page";
import { useStore } from "@/store";
import { sanitizeAIListOutput } from "@/utils/text";
import { ForumNavigator } from "../ForumNavigator";
import { Author } from "./Author";
import { Tabs } from "../Tabs";
import { Sentiment } from "./Sentiment";
import { Reply } from "./Reply";

export default function Page({ params, searchParams }) {
    const { topicId } = params;
    const { username, chatid } = searchParams;

    let { getCachedTopic, cacheTopic, OPForum, setOPForum } = useStore();

    const [topic, setTopic] = useState(getCachedTopic(topicId));
    const [forum, setForum] = useState(OPForum);
    const [activeDisplay, setActiveDisplay] = useState("tldr");

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!forum) {
                    const forum = await fetchForumById(1);
                    setForum(forum);
                    setOPForum(forum);
                }
                if (!topic) {
                    let topicDb = await fetchOPTopicById(topicId);
                    const postsDb = await fetchOPPostsByTopicId(topicId);
                    topicDb.posts = postsDb;
                    setTopic(topicDb);
                    cacheTopic(topicDb);
                }
            } catch (err) {
                console.log(err);
            }
        };
        fetchData();
    }, [topicId]);

    if (!topic || !forum) {
        return null;
    }

    const replies = topic.posts
        .filter((p) => p.post_number > 1)
        .sort((a, b) => b.post_number - a.post_number);
    return (
        <React.Fragment
            title="Post"
            children={
                <>
                    <div
                        className={clsx(
                            "flex flex-col w-full items-center p-4 bg-isSystemLightSecondary grow overflow-hidden",
                            MAX_WIDTH,
                        )}
                    >
                        <ForumNavigator
                            backUrl={`${process.env.NEXT_PUBLIC_SERVER_URL}/forum/optimism/?username=${username}&chatid=${chatid}`}
                            forum={forum}
                            url={topic.first_post_url}
                            backText={`${forum.name} Forum`}
                            buttonText="Original Post"
                        />
                        <div
                            className={clsx(
                                "flex flex-col w-full items-center p-2 grow bg-isSystemLightSecondary overflow-scroll hide-scrollbar mt-5 mb-[50px]",
                                "touch-pan-y",
                                MAX_WIDTH,
                            )}
                        >
                            <div
                                style={{
                                    padding: "0px 0px 5px 0px",
                                    width: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    textAlign: "left",
                                    justifyContent: "flex-start",
                                    alignItems: "flex-start",
                                }}
                            >
                                <h1
                                    style={{
                                        fontSize: "22px",
                                        fontWeight: "600",
                                        color: "#000",
                                    }}
                                >
                                    {topic.title}
                                </h1>

                                <div
                                    style={{
                                        padding: "20px 0px 0px 4px",
                                    }}
                                >
                                    <Author topic={topic} />
                                </div>

                                <Tabs
                                    activeDisplay={activeDisplay}
                                    setActiveDisplay={setActiveDisplay}
                                    primary_color={forum.primary_color}
                                    options={[
                                        { text: "TLDR", state: "tldr" },
                                        {
                                            text: "Community",
                                            state: "community",
                                        },
                                    ]}
                                />
                            </div>

                            <div
                                style={{
                                    width: "calc(100% + 8px)",
                                    marginLeft: "-16px",
                                    marginRight: "-16px",
                                    borderRadius: "10px",
                                    backgroundColor: "#fff",
                                    padding: "20px",
                                    flexGrow: 1,
                                }}
                            >
                                {activeDisplay === "tldr" && (
                                    <div>
                                        <h1
                                            style={{
                                                fontSize: "16px",
                                                fontWeight: 600,
                                                marginBottom: "4px",
                                            }}
                                        >
                                            Summary
                                        </h1>
                                        <p
                                            style={{
                                                fontSize: "13px",
                                                color: "#8E8E8E",
                                            }}
                                        >
                                            {topic.summary}
                                        </p>
                                        <h1
                                            style={{
                                                fontSize: "16px",
                                                fontWeight: 600,
                                                marginTop: "20px",
                                                marginBottom: "4px",
                                            }}
                                        >
                                            Insights
                                        </h1>
                                        <p
                                            style={{
                                                fontSize: "13px",
                                                color: "#8E8E8E",
                                                marginLeft: "18px",
                                                textIndent: "-18px",
                                                whiteSpace: "pre-line",
                                            }}
                                        >
                                            {sanitizeAIListOutput(
                                                topic.insight,
                                            ).map((p) => (
                                                <li class="mb-1">{p}</li>
                                            ))}
                                        </p>
                                    </div>
                                )}
                                {activeDisplay === "community" &&
                                replies.length ? (
                                    <div>
                                        <h1
                                            style={{
                                                fontSize: "16px",
                                                fontWeight: 600,
                                                marginBottom: "4px",
                                            }}
                                        >
                                            Commnity Feedback
                                        </h1>

                                        <div
                                            style={{
                                                width: "100%",
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "flex-start",
                                                marginTop: "10px",
                                            }}
                                        >
                                            <Sentiment
                                                topic={topic}
                                                color={forum.primary_color}
                                            />
                                            <div
                                                style={{
                                                    fontSize: "13px",
                                                    color: "#8E8E8E",
                                                    whiteSpace: "pre-line",
                                                    marginLeft: "18px",
                                                    textIndent: "-18px",
                                                    marginTop: "15px",
                                                }}
                                            >
                                                {sanitizeAIListOutput(
                                                    topic.community_summary,
                                                ).map((p) => (
                                                    <li class="mb-1">{p}</li>
                                                ))}
                                            </div>
                                        </div>

                                        <h1
                                            style={{
                                                fontSize: "16px",
                                                fontWeight: 600,
                                                marginTop: "25px",
                                                marginBottom: "4px",
                                            }}
                                        >
                                            Latest Conversation
                                        </h1>
                                        <div
                                            style={{
                                                width: "100%",
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "flex-start",
                                                marginTop: "10px",
                                                gap: "15px",
                                            }}
                                        >
                                            {replies.map((post) => (
                                                <div
                                                    style={{
                                                        gap: "15px",
                                                        display: "flex",
                                                        flexDirection: "column",
                                                    }}
                                                >
                                                    <Reply post={post} />
                                                    <Hr
                                                        classes={clsx("!px-3")}
                                                        useDarkColor={false}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : null}
                                {activeDisplay === "community" &&
                                    !replies.length && (
                                        <p
                                            style={{
                                                fontSize: "16px",
                                                fontWeight: 600,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            No community feedback yet
                                        </p>
                                    )}
                            </div>
                        </div>
                    </div>

                    <div class="w-full flex justify-evenly fixed bg-isSystemLightSecondary h-[50px] bottom-0 left-0">
                        <Link
                            style={{
                                fontSize: "16px",
                                color: "#fff",
                                backgroundColor: forum.primary_color,
                                width: "90%",
                                height: "90%",
                                borderRadius: "15px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                            href={topic.first_post_url}
                            target="_blank"
                        >
                            Visit Now
                        </Link>
                    </div>
                </>
            }
        />
    );
}
