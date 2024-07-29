"use client";
import clsx from "clsx";
import React, { useState, useEffect } from "react";
import { ANIMATE, MAX_WIDTH } from "@/components/constants";
import {
    fetchForumById,
    fetchLatestPostsByForumId,
    fetchTrendingPostsByForumId,
} from "@/components/db/forum";
import { PageLoader, Spinner } from "@/components/loaders";
import { ProtocolIcon } from "@/components/page/ProtocolIcon";
import IosShareIcon from "@mui/icons-material/IosShare";
import Masonry from "react-masonry-css";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CommentsIcon from "@/public/assets/comments.png";
import ViewsIcon from "@/public/assets/views.png";

export default function Page({ params, searchParams }) {
    const { forumId } = params;
    const { username, chatid, from } = searchParams;
    const router = useRouter();
    const [protocolForum, setProtocolForum] = useState(null);
    const [activeDisplay, setActiveDisplay] = useState("trending");
    const [trendingPosts, setTrendingPosts] = useState(null);
    const [latestPosts, setLatestPosts] = useState(null);
    const [trendingPostTags, setTrendingPostTags] = useState([]);
    const [latestPostTags, setLatestPostTags] = useState([]);

    useEffect(() => {
        const getProtocolInfo = async () => {
            try {
                const forumData = await fetchForumById(forumId);
                setProtocolForum(forumData);

                // TODO: implement as infinite-scroll
                const latestPosts = await fetchLatestPostsByForumId(forumId);
                setLatestPosts(latestPosts);
                // setLatestPostTags(
                //     latestPostsResponse.data.map((post) =>
                //         foraInfo[protocolForum.protocolId].tags.filter((t) =>
                //             post.tags.includes(t.name),
                //         ),
                //     ),
                // );

                // TODO: implement as infinite-scroll
                const trendingPosts =
                    await fetchTrendingPostsByForumId(forumId);
                setTrendingPosts(trendingPosts);

                console.log(latestPosts.map((p) => p.created_at));
                // setTrendingPostTags(
                //     trendingPostsResponse.data.map((post) =>
                //         foraInfo[protocolForum.protocolId].tags.filter((t) =>
                //             post.tags.includes(t.name),
                //         ),
                //     ),
                // );
            } catch (error) {
                console.error(error);
            }
        };
        getProtocolInfo();
    }, []);

    if (!protocolForum || !trendingPosts || !latestPosts) {
        return <Spinner />
    }

    return (
        <>
            <React.Fragment
                title="Protocol"
                children={
                    // Set screen width to be consistent with other pages
                    <div
                        className={clsx(
                            "flex flex-col w-full items-center p-4 grow bg-isSystemLightSecondary overflow-scroll hide-scrollbar",
                            MAX_WIDTH,
                        )}
                        // hide scrollbar
                        style={{
                            scrollbarWidth: "none",
                            msOverflowStyle: "none",
                            overflowX: "hidden",
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
                                        `${process.env.NEXT_PUBLIC_SERVER_URL}/protocols?username=${username}&chatid=${chatid}&from=${from}`,
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
                                    color: protocolForum?.primary_color,
                                }}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className={clsx("w-6 h-6", ANIMATE)}
                                    style={{
                                        fill:
                                            protocolForum?.primary_color ||
                                            "var(--isBlueLight)",
                                        stroke:
                                            protocolForum?.primary_color ||
                                            "var(--isBlueLight)",
                                    }}
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                Protocols
                            </button>
                            <Link
                                href={`${protocolForum?.forum_url}`}
                                target="_blank"
                                style={{
                                    padding: "4px 8px",
                                    borderRadius: "33px",
                                    display: "flex",
                                    justifyContent: "space-evenly",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    fontSize: "13px",
                                    color: protocolForum?.primary_color,
                                    backgroundColor:
                                        protocolForum?.background_color,
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
                                    Go to forum
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
                                justifyContent: "center",
                                alignItems: "center",
                                marginTop: "30px",
                            }}
                        >
                            <img
                                src={protocolForum?.forum_icon}
                                style={{
                                    width: "58px",
                                    height: "58px",
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                    backgroundColor:
                                        protocolForum?.background_color,
                                }}
                            />
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "flex-start",
                                    marginLeft: "20px",
                                }}
                            >
                                <h1
                                    style={{
                                        fontSize: "20px",
                                        fontWeight: "600",
                                        color: "#000",
                                    }}
                                >
                                    {protocolForum?.forum_title}
                                </h1>
                                <p
                                    style={{
                                        fontSize: "15px",
                                        color: "#000",
                                    }}
                                >
                                    {protocolForum?.forum_weekly_summary &&
                                        protocolForum?.forum_weekly_summary
                                            .length > 0 &&
                                        protocolForum?.forum_weekly_summary
                                            .split(". ")
                                            .slice(0, 1)
                                            .join(". ")}
                                    .
                                </p>
                            </div>
                        </div>

                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                width: "90%",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    marginTop: "30px",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "flex-end",
                                    marginRight: "6px",
                                    width: "30%",
                                    padding: "12px 16px",
                                    borderRadius: "8px",
                                    backgroundImage:
                                        "linear-gradient(45deg, #FFFFFF 0%, #F9F1E9 100%)",
                                }}
                            >
                                <h1
                                    style={{
                                        fontSize: "16px",
                                        fontWeight: "600",
                                        color: "#000",
                                    }}
                                >
                                    {protocolForum?.forum_num_replies}
                                </h1>
                                <p
                                    style={{
                                        fontSize: "13px",
                                        color: "#000",
                                    }}
                                >
                                    replies
                                </p>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    marginTop: "30px",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "flex-end",
                                    marginRight: "6px",
                                    width: "31%",
                                    padding: "12px 16px",
                                    borderRadius: "8px",
                                    backgroundImage:
                                        "linear-gradient(45deg, #FFFFFF 0%, #E9F0F9 100%)",
                                }}
                            >
                                <h1
                                    style={{
                                        fontSize: "16px",
                                        fontWeight: "600",
                                        color: "#000",
                                    }}
                                >
                                    {protocolForum?.forum_num_new_posts}
                                </h1>
                                <p
                                    style={{
                                        fontSize: "13px",
                                        color: "#000",
                                    }}
                                >
                                    new posts
                                </p>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    marginTop: "30px",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "flex-end",
                                    width: "40%",
                                    padding: "12px 16px",
                                    borderRadius: "8px",
                                    backgroundImage:
                                        "linear-gradient(45deg, #FFFFFF 0%, #F2ADB1 100%)",
                                }}
                            >
                                <h1
                                    style={{
                                        fontSize: "16px",
                                        fontWeight: "600",
                                        color: "#000",
                                    }}
                                >
                                    {protocolForum?.forum_num_trending_topics}
                                </h1>
                                <p
                                    style={{
                                        fontSize: "13px",
                                        color: "#000",
                                    }}
                                >
                                    trending topics
                                </p>
                            </div>
                        </div>

                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "flex-start",
                                alignItems: "center",
                                width: "100%",
                                padding: "20px 0px",
                            }}
                        >
                            <button
                                onClick={() => setActiveDisplay("trending")}
                                style={{
                                    padding: "8px 16px",
                                    color:
                                        activeDisplay === "trending"
                                            ? "#000"
                                            : "rgba(0, 0, 0, 0.5)",
                                    fontSize: "15px",
                                    fontWeight:
                                        activeDisplay === "trending"
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
                                Trending
                                <div
                                    style={{
                                        height: "3px",
                                        width:
                                            activeDisplay === "trending"
                                                ? "15px"
                                                : "0px",
                                        backgroundColor:
                                            protocolForum?.primary_color,
                                        marginTop: "2px",
                                        transition: "all 0.3s ease",
                                    }}
                                />
                            </button>
                            <button
                                onClick={() => setActiveDisplay("latest")}
                                style={{
                                    padding: "8px 16px",
                                    color:
                                        activeDisplay === "latest"
                                            ? "#000"
                                            : "rgba(0, 0, 0, 0.5)",
                                    fontSize: "15px",
                                    fontWeight:
                                        activeDisplay === "latest"
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
                                Latest
                                <div
                                    style={{
                                        height: "3px",
                                        width:
                                            activeDisplay === "latest"
                                                ? "15px"
                                                : "0px",
                                        backgroundColor:
                                            protocolForum?.primary_color,
                                        marginTop: "2px",
                                        transition: "all 0.3s ease",
                                    }}
                                />
                            </button>
                        </div>

                        {protocolForum && activeDisplay === "trending" && (
                            <div
                                style={{
                                    padding: "0px 0px 0px 10px",
                                }}
                            >
                                {trendingPosts.length > 0 ? (
                                    <Masonry
                                        breakpointCols={{
                                            default: 2,
                                        }}
                                        className="my-masonry-grid"
                                        columnClassName="my-masonry-grid_column"
                                    >
                                        {trendingPosts.map((post, index) => (
                                            <button
                                                onClick={() =>
                                                    router.push(
                                                        `${process.env.NEXT_PUBLIC_SERVER_URL}/forum/${forumId}/${post.id}?username=${username}&chatid=${chatid}&from=${from}`,
                                                    )
                                                }
                                                style={{
                                                    backgroundColor: "#fff",
                                                    borderRadius: "10px",
                                                    padding:
                                                        "10px 11px 4px 18px",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    justifyContent: "center",
                                                    alignItems: "flex-start",
                                                    textAlign: "left",
                                                    marginBottom: "8px",
                                                    maxWidth: "175px",
                                                }}
                                            >
                                                <p
                                                    style={{
                                                        fontSize: "12px",
                                                        color: "#A2A2AE",
                                                        marginTop: "10px",
                                                    }}
                                                >
                                                    {post.date}
                                                </p>
                                                <div
                                                    style={{
                                                        marginTop: "10px",
                                                        display: "flex",
                                                        flexDirection: "row",
                                                        flexWrap: "wrap",
                                                        justifyContent:
                                                            "flex-start",
                                                    }}
                                                >
                                                    {" "}
                                                    {index <
                                                        trendingPostTags.length &&
                                                        trendingPostTags[
                                                            index
                                                        ] &&
                                                        trendingPostTags[
                                                            index
                                                        ].map((tag, i) => (
                                                            <p
                                                                key={i}
                                                                style={{
                                                                    fontSize:
                                                                        "10px",
                                                                    color: tag.primary_color,
                                                                    padding:
                                                                        "3px 6px",
                                                                    borderRadius:
                                                                        "25px",
                                                                    marginRight:
                                                                        "5px",
                                                                    marginBottom:
                                                                        "5px",
                                                                    backgroundColor:
                                                                        tag.background_color,
                                                                }}
                                                            >
                                                                {tag.emoji}{" "}
                                                                {tag}
                                                            </p>
                                                        ))}
                                                </div>
                                                <h1
                                                    style={{
                                                        fontSize: "16px",
                                                        fontWeight: "600",
                                                        color: "#000",
                                                        marginTop: "6px",
                                                    }}
                                                >
                                                    {post.title}
                                                </h1>
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        flexDirection: "row",
                                                        justifyContent:
                                                            "center",
                                                        alignItems: "center",
                                                        marginTop: "10px",
                                                        color: "#A2A2AE",
                                                        fontSize: "13px",
                                                        marginBottom: "10px",
                                                        marginRight: "10px",
                                                    }}
                                                >
                                                    <p
                                                        style={{
                                                            display: "flex",
                                                            flexDirection:
                                                                "row",
                                                            fontSize: "13px",
                                                            color: "#A2A2AE",
                                                            justifyContent:
                                                                "center",
                                                            alignItems:
                                                                "center",
                                                            marginRight: "10px",
                                                        }}
                                                    >
                                                        <img
                                                            src={ViewsIcon.src}
                                                            style={{
                                                                height: "10px",
                                                                marginRight:
                                                                    "5px",
                                                            }}
                                                        />
                                                        {post.num_views}
                                                    </p>

                                                    <p
                                                        style={{
                                                            display: "flex",
                                                            flexDirection:
                                                                "row",
                                                            fontSize: "13px",
                                                            color: "#A2A2AE",
                                                            justifyContent:
                                                                "center",
                                                            alignItems:
                                                                "center",
                                                            marginRight: "10px",
                                                        }}
                                                    >
                                                        <img
                                                            src={
                                                                CommentsIcon.src
                                                            }
                                                            style={{
                                                                height: "10px",
                                                                marginRight:
                                                                    "5px",
                                                            }}
                                                        />
                                                        {post.num_comments}
                                                    </p>
                                                </div>
                                            </button>
                                        ))}
                                    </Masonry>
                                ) : (
                                    "No trending posts available."
                                )}
                            </div>
                        )}

                        {protocolForum && activeDisplay === "latest" && (
                            <div
                                style={{
                                    padding: "0px 0px 0px 10px",
                                }}
                            >
                                {latestPosts.length > 0 ? (
                                    <Masonry
                                        breakpointCols={{
                                            default: 2,
                                        }}
                                        className="my-masonry-grid"
                                        columnClassName="my-masonry-grid_column"
                                    >
                                        {latestPosts.map((post, index) => (
                                            <button
                                                onClick={() =>
                                                    router.push(
                                                        `${process.env.NEXT_PUBLIC_SERVER_URL}/forum/${forumId}/${post.id}?username=${username}&chatid=${chatid}&from=${from}`,
                                                    )
                                                }
                                                style={{
                                                    backgroundColor: "#fff",
                                                    borderRadius: "10px",
                                                    padding:
                                                        "10px 11px 4px 18px",
                                                    display: "flex",
                                                    textAlign: "left",
                                                    flexDirection: "column",
                                                    justifyContent: "center",
                                                    alignItems: "flex-start",
                                                    marginBottom: "8px",
                                                }}
                                            >
                                                <p
                                                    style={{
                                                        fontSize: "12px",
                                                        color: "#A2A2AE",
                                                        marginTop: "10px",
                                                    }}
                                                >
                                                    {post.date}
                                                </p>
                                                <div
                                                    style={{
                                                        marginTop: "10px",
                                                        display: "flex",
                                                        flexDirection: "row",
                                                        flexWrap: "wrap",
                                                        justifyContent:
                                                            "flex-start",
                                                    }}
                                                >
                                                    {" "}
                                                    {index <
                                                        latestPostTags.length &&
                                                        latestPostTags[index] &&
                                                        latestPostTags[
                                                            index
                                                        ].map((tag, i) => (
                                                            <p
                                                                key={i}
                                                                style={{
                                                                    fontSize:
                                                                        "10px",
                                                                    color: tag.primary_color,
                                                                    padding:
                                                                        "3px 6px",
                                                                    borderRadius:
                                                                        "25px",
                                                                    marginRight:
                                                                        "5px",
                                                                    marginBottom:
                                                                        "5px",
                                                                    backgroundColor:
                                                                        tag.background_color,
                                                                }}
                                                            >
                                                                {tag.emoji}{" "}
                                                                {tag}
                                                            </p>
                                                        ))}
                                                </div>
                                                <h1
                                                    style={{
                                                        fontSize: "16px",
                                                        fontWeight: "600",
                                                        color: "#000",
                                                        marginTop: "6px",
                                                    }}
                                                >
                                                    {post.title}
                                                </h1>
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        flexDirection: "row",
                                                        justifyContent:
                                                            "center",
                                                        alignItems: "center",
                                                        marginTop: "10px",
                                                        color: "#A2A2AE",
                                                        fontSize: "13px",
                                                        marginBottom: "10px",
                                                    }}
                                                >
                                                    <p
                                                        style={{
                                                            display: "flex",
                                                            flexDirection:
                                                                "row",
                                                            fontSize: "13px",
                                                            color: "#A2A2AE",
                                                            justifyContent:
                                                                "center",
                                                            alignItems:
                                                                "center",
                                                            marginRight: "10px",
                                                        }}
                                                    >
                                                        <img
                                                            src={ViewsIcon.src}
                                                            style={{
                                                                height: "10px",
                                                                marginRight:
                                                                    "5px",
                                                            }}
                                                        />
                                                        {post.num_views}
                                                    </p>

                                                    <p
                                                        style={{
                                                            display: "flex",
                                                            flexDirection:
                                                                "row",
                                                            fontSize: "13px",
                                                            color: "#A2A2AE",
                                                            justifyContent:
                                                                "center",
                                                            alignItems:
                                                                "center",
                                                            marginRight: "10px",
                                                        }}
                                                    >
                                                        <img
                                                            src={
                                                                CommentsIcon.src
                                                            }
                                                            style={{
                                                                height: "10px",
                                                                marginRight:
                                                                    "5px",
                                                            }}
                                                        />
                                                        {post.num_comments}
                                                    </p>
                                                </div>
                                            </button>
                                        ))}
                                    </Masonry>
                                ) : (
                                    "No latest posts available."
                                )}
                            </div>
                        )}
                    </div>
                }
            />
            <style jsx global>
                {`
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }

                    .my-masonry-grid {
                        display: flex;
                        margin-left: -10px; /* gutter size offset */
                        width: auto;
                    }

                    .my-masonry-grid_column {
                        padding-left: 10px; /* gutter size */
                        background-clip: padding-box;
                    }

                    .next-image {
                        width: 100% !important;
                        height: auto !important;
                        object-fit: cover;
                    }
                `}
            </style>
        </>
    );
}
