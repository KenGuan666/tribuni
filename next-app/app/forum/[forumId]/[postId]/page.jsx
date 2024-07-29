"use client";
import clsx from "clsx";
import React, { useState, useEffect } from "react";
import { ANIMATE, MAX_WIDTH } from "@/components/constants";
import { fetchForumById, fetchForumPostById } from "@/components/db/forum";
import { PageLoader, Spinner } from "@/components/loaders";
import { ProtocolIcon } from "@/components/page/ProtocolIcon";
import IosShareIcon from "@mui/icons-material/IosShare";
import Masonry from "react-masonry-css";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ViewsIcon from "@/public/assets/views.png";
import LikesIcon from "@/public/assets/likes.png";
import LikesRedIcon from "@/public/assets/likes_red.png";
import CommentsIcon from "@/public/assets/comments.png";
import BookmarkIcon from "@/public/assets/bookmark.jsx";
import QuoteIcon from "@/public/assets/quote.jsx";

export default function Page({ params, searchParams }) {
    const { forumId, postId } = params;
    const { username, chatid, from } = searchParams;
    const router = useRouter();
    const [protocolForum, setProtocolForum] = useState(null);
    const [protocolForumPost, setProtocolForumPost] = useState(null);
    const [activeDisplay, setActiveDisplay] = useState("tldr");
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const protocolForum = await fetchForumById(forumId);
                setProtocolForum(protocolForum);

                const postInfo = await fetchForumPostById(postId);
                setProtocolForumPost(postInfo);

                setLoading(false);
            } catch (err) {
                console.log(err);
            }
            setLoading(false);
        };
        fetchData();
    }, [forumId, postId]);

    if (!protocolForumPost) {
        return null;
    }

    return (
        <PageLoader
            title="Post"
            children={
                <>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            minHeight: "100vh",
                            backgroundColor: "#F9F9F9",
                        }}
                    >
                        <div
                            className={clsx(
                                "flex flex-col w-full items-center p-4 grow bg-isSystemLightSecondary overflow-scroll",
                                MAX_WIDTH,
                            )}
                            // hide scrollbar
                            style={{
                                scrollbarWidth: "none",
                                msOverflowStyle: "none",
                                paddingBottom: "40px",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    width: "100%",
                                }}
                            >
                                <button
                                    onClick={() => {
                                        router.push(
                                            `${process.env.NEXT_PUBLIC_SERVER_URL}/forum/${forumId}?username=${username}&chatid=${chatid}&from=${from}`,
                                        );
                                    }}
                                    style={{
                                        position: "relative",
                                        padding: "2px 0px",
                                        borderRadius: "33px",
                                        maxWidth: "150px",
                                        display: "flex",
                                        justifyContent: "space-evenly",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        fontSize: "13px",
                                        color: protocolForum?.primaryColor,
                                    }}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className={clsx("w-6 h-6", ANIMATE)}
                                        style={{
                                            fill:
                                                protocolForum?.primaryColor ||
                                                "var(--isBlueLight)",
                                            stroke:
                                                protocolForum?.primaryColor ||
                                                "var(--isBlueLight)",
                                        }}
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    {protocolForum?.name}
                                </button>
                                <Link
                                    href={`${protocolForumPost?.postURL}`}
                                    target="_blank"
                                    style={{
                                        padding: "4px 8px",
                                        borderRadius: "33px",
                                        display: "flex",
                                        justifyContent: "space-evenly",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        fontSize: "13px",
                                        color: protocolForum?.primaryColor,
                                        backgroundColor:
                                            protocolForum?.backgroundColor,
                                    }}
                                >
                                    {protocolForum && (
                                        <ProtocolIcon
                                            protocol={protocolForum}
                                            fill={false}
                                            size={16}
                                        />
                                    )}{" "}
                                    <p
                                        style={{
                                            marginLeft: "5px",
                                            marginRight: "5px",
                                        }}
                                    >
                                        Original Post
                                    </p>
                                    <IosShareIcon
                                        style={{
                                            height: "16px",
                                            width: "16px",
                                        }}
                                    />
                                </Link>
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    width: "90%",
                                    justifyContent: "flex-start",
                                    alignItems: "center",
                                    marginTop: "30px",
                                }}
                            >
                                <p
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        fontSize: "13px",
                                        color: "#A2A2AE",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginRight: "10px",
                                    }}
                                >
                                    <img
                                        src={ViewsIcon.src}
                                        style={{
                                            height: "10px",
                                            marginRight: "5px",
                                        }}
                                    />
                                    {protocolForumPost?.numViews}
                                </p>
                                {/* <p
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        fontSize: "13px",
                                        color: "#A2A2AE",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginRight: "10px",
                                    }}
                                >
                                    <img
                                        src={LikesIcon.src}
                                        style={{
                                            height: "10px",
                                            marginRight: "5px",
                                        }}
                                    />
                                    {protocolForumPost?.numLikes}
                                </p> */}
                                <p
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        fontSize: "13px",
                                        color: "#A2A2AE",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <img
                                        src={CommentsIcon.src}
                                        style={{
                                            height: "10px",
                                            marginRight: "5px",
                                        }}
                                    />
                                    {protocolForumPost?.numComments}
                                </p>
                            </div>

                            <h1
                                style={{
                                    fontSize: "18px",
                                    fontWeight: "600",
                                    color: "#000",
                                    width: "90%",
                                    marginTop: "12px",
                                }}
                            >
                                {protocolForumPost?.title}
                            </h1>

                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "flex-start",
                                    alignItems: "center",
                                    width: "100%",
                                    padding: "12px 0px",
                                }}
                            >
                                <button
                                    onClick={() => setActiveDisplay("tldr")}
                                    style={{
                                        padding: "8px 16px",
                                        color:
                                            activeDisplay === "tldr"
                                                ? "#000"
                                                : "rgba(0, 0, 0, 0.5)",
                                        fontSize: "15px",
                                        fontWeight:
                                            activeDisplay === "tldr"
                                                ? "600"
                                                : "400",
                                        marginRight: "10px",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        flexDirection: "column",
                                        transition: "all 0.3s ease",
                                    }}
                                >
                                    TLDR
                                    <div
                                        style={{
                                            height: "3px",
                                            width:
                                                activeDisplay === "tldr"
                                                    ? "15px"
                                                    : "0px",
                                            backgroundColor:
                                                protocolForum?.primaryColor,
                                            marginTop: "2px",
                                            transition: "all 0.3s ease",
                                        }}
                                    />
                                </button>
                                <button
                                    onClick={() =>
                                        setActiveDisplay("community")
                                    }
                                    style={{
                                        padding: "8px 16px",
                                        color:
                                            activeDisplay === "community"
                                                ? "#000"
                                                : "rgba(0, 0, 0, 0.5)",
                                        fontSize: "15px",
                                        fontWeight:
                                            activeDisplay === "community"
                                                ? "600"
                                                : "400",
                                        marginRight: "10px",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        flexDirection: "column",
                                        transition: "all 0.3s ease",
                                    }}
                                >
                                    Community
                                    <div
                                        style={{
                                            height: "3px",
                                            width:
                                                activeDisplay === "community"
                                                    ? "15px"
                                                    : "0px",
                                            backgroundColor:
                                                protocolForum?.primaryColor,
                                            marginTop: "2px",
                                            transition: "all 0.3s ease",
                                        }}
                                    />
                                </button>
                            </div>

                            {protocolForumPost && activeDisplay === "tldr" && (
                                <div
                                    style={{
                                        width: "calc(100% + 32px)",
                                        marginLeft: "-16px",
                                        marginRight: "-16px",
                                        borderRadius: "10px 10px 0px 0px",
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
                                            color: "#A2A2AE",
                                        }}
                                    >
                                        {protocolForumPost?.summary}
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
                                            color: "#A2A2AE",
                                        }}
                                    >
                                        {protocolForumPost?.insights}
                                    </p>
                                </div>
                            )}

                            {protocolForumPost &&
                                activeDisplay === "community" && (
                                    <div
                                        style={{
                                            width: "calc(100% + 32px)",
                                            marginLeft: "-16px",
                                            marginRight: "-16px",
                                            borderRadius: "10px 10px 0px 0px",
                                            backgroundColor: "#fff",
                                            padding: "20px",
                                            flexGrow: 1,
                                        }}
                                    >
                                        {protocolForumPost?.consensusSentimentPercent &&
                                            protocolForumPost?.consensusSentimentPercent !==
                                                null && (
                                                <>
                                                    <h1
                                                        style={{
                                                            fontSize: "16px",
                                                            fontWeight: 600,
                                                            marginBottom:
                                                                "20px",
                                                        }}
                                                    >
                                                        Consensus
                                                    </h1>
                                                    <div
                                                        style={{
                                                            width: "100%",
                                                            display: "flex",
                                                            flexDirection:
                                                                "row",
                                                            justifyContent:
                                                                "flex-start",
                                                            alignItems:
                                                                "center",
                                                        }}
                                                    >
                                                        <p
                                                            style={{
                                                                color: "#A2A2AE",
                                                                fontSize:
                                                                    "13px",
                                                                marginLeft:
                                                                    "20px",
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
                                                                    protocolForumPost?.consensusSentimentPercent
                                                                }
                                                                %
                                                            </span>
                                                            of replies{" "}
                                                            {protocolForumPost?.consensusSentimentMajority ===
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
                                                            alignItems:
                                                                "center",
                                                            padding: "0px 10px",
                                                            position:
                                                                "relative",
                                                            marginBottom:
                                                                "60px",
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
                                                                    protocolForum?.primaryColor,
                                                                width: `calc(${protocolForumPost?.consensusSentimentPercent}%)`,
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
                                            {protocolForumPost?.communityFeedback &&
                                            protocolForumPost?.communityFeedback
                                                .length > 0 ? (
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
                                                    {protocolForumPost?.communityFeedback.map(
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
                                                        marginTop: "10px",
                                                    }}
                                                >
                                                    No community feedback found.
                                                </p>
                                            )}
                                        </div>
                                        {protocolForumPost?.popularVoice &&
                                            Object.keys(
                                                protocolForumPost.popularVoice,
                                            ).length > 0 && (
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
                                                            flexDirection:
                                                                "row",
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
                                                                fontSize:
                                                                    "13px",
                                                                width: "90%",
                                                                marginRight:
                                                                    "20px",
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
                                                                    protocolForumPost
                                                                        ?.popularVoice
                                                                        .author
                                                                }
                                                                :
                                                            </span>{" "}
                                                            {
                                                                protocolForumPost
                                                                    ?.popularVoice
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
                                                                marginTop:
                                                                    "10px",
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
                                                                    protocolForumPost // change to numViews
                                                                        ?.popularVoice
                                                                        .numViews
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
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
                            padding: "10px",
                            height: "60px",
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
                                backgroundColor: protocolForum?.backgroundColor,
                            }}
                        >
                            <BookmarkIcon
                                fillColor={protocolForum?.primaryColor}
                                strokeWidth={3}
                                height="20px"
                                width="20px"
                            />
                        </div> */}
                        <Link
                            style={{
                                fontSize: "12px",
                                color: "#fff",
                                backgroundColor: protocolForum?.primaryColor,
                                width: "90%",
                                borderRadius: "10px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                            href={
                                protocolForumPost?.postURL
                                    ? protocolForumPost?.postURL
                                    : ""
                            }
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
