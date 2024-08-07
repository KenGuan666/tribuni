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
import QuoteIcon from "@/public/assets/quote.jsx";
import { useStore } from "@/store";
import { ForumNavigator } from "../ForumNavigator";
import { Author } from "./Author";
import { Tabs } from "../Tabs";

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

                            {activeDisplay === "tldr" && (
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
                                            whiteSpace: "pre-line",
                                        }}
                                    >
                                        {topic.insight}
                                    </p>
                                </div>
                            )}

                            {topic && activeDisplay === "community" && (
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
                                    Coming Soon
                                    {/* {post?.consensus_sentiment_percent &&
                                        post?.consensus_sentiment_percent !==
                                            null && (
                                            <>
                                                <h1
                                                    style={{
                                                        fontSize: "16px",
                                                        fontWeight: 600,
                                                        marginBottom: "20px",
                                                    }}
                                                >
                                                    Consensus
                                                </h1>
                                                <div
                                                    style={{
                                                        width: "100%",
                                                        display: "flex",
                                                        flexDirection: "row",
                                                        justifyContent:
                                                            "flex-start",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    <p
                                                        style={{
                                                            color: "#A2A2AE",
                                                            fontSize: "13px",
                                                            marginLeft: "20px",
                                                            width: "80%",
                                                        }}
                                                    >
                                                        <span
                                                            style={{
                                                                color: "#000",
                                                                fontWeight: 600,
                                                                fontSize:
                                                                    "16px",
                                                                marginRight:
                                                                    "8px",
                                                            }}
                                                        >
                                                            {
                                                                post?.consensus_sentiment_percent
                                                            }
                                                            %
                                                        </span>
                                                        of replies{" "}
                                                        {post?.consensus_sentiment_majority ===
                                                        "yes"
                                                            ? "support or have favorable feelings toward"
                                                            : "do not support or have unfavorable feelings toward"}{" "}
                                                        this post
                                                    </p>
                                                </div>

                                                <div
                                                    style={{
                                                        marginTop: "20px",
                                                        width: "100%",
                                                        alignItems: "center",
                                                        padding: "0px 10px",
                                                        position: "relative",
                                                        marginBottom: "60px",
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            position:
                                                                "absolute",
                                                            left: 0,
                                                            top: 0,
                                                            backgroundColor:
                                                                "#E1E2E8",
                                                            width: "100%",
                                                            height: "15px",
                                                            borderRadius:
                                                                "25px",
                                                            zIndex: 1,
                                                        }}
                                                    />
                                                    <div
                                                        style={{
                                                            position:
                                                                "absolute",
                                                            left: 0,
                                                            top: 0,
                                                            backgroundColor:
                                                                forum?.primary_color,
                                                            width: `calc(${post?.consensus_sentiment_percent}%)`,
                                                            height: "15px",
                                                            borderRadius:
                                                                "25px",
                                                            zIndex: 2,
                                                        }}
                                                    />
                                                </div>
                                            </>
                                        )}
                                    <h1
                                        style={{
                                            fontSize: "16px",
                                            fontWeight: 600,
                                            marginBottom: "4px",
                                        }}
                                    >
                                        Community Feedback
                                    </h1>
                                    <div
                                        style={{
                                            width: "100%",
                                            textAlign: "left",
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            marginTop: "4px",
                                            padding: "0px 30px",
                                        }}
                                    >
                                        {post?.community_feedback &&
                                        post?.community_feedback.length > 0 ? (
                                            <ul
                                                style={{
                                                    padding: 0,
                                                    margin: 0,
                                                    listStyleType: "disc",
                                                    listStylePosition:
                                                        "outside",
                                                    color: "#A2A2AE",
                                                    // paddingLeft: "px",
                                                }}
                                            >
                                                {post?.community_feedback.map(
                                                    (feedback, index) => (
                                                        <li
                                                            key={index}
                                                            style={{
                                                                marginBottom:
                                                                    "4px",
                                                                paddingLeft:
                                                                    "0px",
                                                            }}
                                                        >
                                                            <p
                                                                style={{
                                                                    fontSize:
                                                                        "13px",
                                                                    color: "#A2A2AE",
                                                                    margin: 0,
                                                                    textIndent:
                                                                        "0px",
                                                                }}
                                                            >
                                                                {feedback}
                                                            </p>
                                                        </li>
                                                    ),
                                                )}
                                            </ul>
                                        ) : (
                                            <p
                                                style={{
                                                    fontSize: "13px",
                                                    marginTop: "50px",
                                                }}
                                            >
                                                No community feedback found.
                                            </p>
                                        )}
                                    </div>
                                    {post?.popular_voice &&
                                        Object.keys(post.popular_voice).length >
                                            0 && (
                                            <>
                                                <h1
                                                    style={{
                                                        fontSize: "16px",
                                                        fontWeight: 600,
                                                        marginTop: "20px",
                                                        marginBottom: "4px",
                                                    }}
                                                >
                                                    Popular Voice
                                                </h1>
                                                <div
                                                    style={{
                                                        width: "100%",
                                                        display: "flex",
                                                        flexDirection: "row",
                                                        justifyContent:
                                                            "flex-start",
                                                        alignItems:
                                                            "flex-start",
                                                        marginTop: "10px",
                                                    }}
                                                >
                                                    <p
                                                        style={{
                                                            color: "#A2A2AE",
                                                            fontSize: "13px",
                                                            width: "90%",
                                                            marginRight: "20px",
                                                        }}
                                                    >
                                                        <span
                                                            style={{
                                                                fontWeight:
                                                                    "600",
                                                                color: "#737373",
                                                            }}
                                                        >
                                                            {
                                                                post
                                                                    ?.popularVoice
                                                                    .author
                                                            }
                                                            :
                                                        </span>{" "}
                                                        {
                                                            post?.popularVoice
                                                                .text
                                                        }
                                                    </p>
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            flexDirection:
                                                                "column",
                                                            justifyContent:
                                                                "flex-start",
                                                            alignItems:
                                                                "center",
                                                            marginTop: "10px",
                                                        }}
                                                    >
                                                        <QuoteIcon
                                                            fillColor={
                                                                "#A2A2AE"
                                                            }
                                                            height={"100px"}
                                                            width={"100px"}
                                                        />
                                                        <p
                                                            style={{
                                                                color: "rgba(234, 47, 47, 0.6)",
                                                                fontSize:
                                                                    "13px",
                                                            }}
                                                        >
                                                            {
                                                                post // change to numViews
                                                                    ?.popularVoice
                                                                    .num_views
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </>
                                        )}*/}
                                </div>
                            )}
                        </div>
                    </div>

                    <div
                        style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "space-evenly",
                            position: "fixed",
                            backgroundColor: "#F9F9F9",
                            height: "50px",
                            bottom: 0,
                            left: 0,
                        }}
                    >
                        {/* <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                padding: "10px",
                                borderRadius: "10px",
                                backgroundColor: forum?.background_color,
                            }}
                        >
                            <BookmarkIcon
                                fillColor={forum?.primary_color}
                                strokeWidth={3}
                                height="20px"
                                width="20px"
                            />
                        </div> */}
                        <Link
                            style={{
                                fontSize: "16px",
                                color: "#fff",
                                backgroundColor: forum?.primary_color,
                                width: "90%",
                                borderRadius: "10px",
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
