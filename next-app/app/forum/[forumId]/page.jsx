"use client";
import clsx from "clsx";
import React, { useState, useEffect } from "react";
import { ANIMATE, MAX_WIDTH } from "@/components/constants";
import {
    fetchForumById,
    fetchLatestPostsByForumId,
    fetchTrendingPostsByForumId,
} from "@/components/db/forum";
import { ForumNavigator } from "./ForumNavigator";
import { Spinner } from "@/components/loaders";
import Masonry from "react-masonry-css";
import { ForumStatsSummary } from "./ForumStatsSummary";
import { PostPreview } from "./PostPreview";
import { Tabs } from "./Tabs";

export default function Page({ params, searchParams }) {
    const { forumId } = params;
    const { username, chatid, from } = searchParams;
    const [protocolForum, setProtocolForum] = useState(null);
    const [trendingPosts, setTrendingPosts] = useState(null);
    const [activeDisplay, setActiveDisplay] = useState("latest");
    const [latestPosts, setLatestPosts] = useState(null);
    const [trendingPostTags, setTrendingPostTags] = useState([]);
    const [latestPostTags, setLatestPostTags] = useState([]);

    let postsToShow = null;

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
        return <Spinner />;
    }

    // Ignore "from" parameter for now, and always send user back to protocols page
    const backUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/protocols?username=${username}&chatid=${chatid}`;
    postsToShow = activeDisplay === "latest" ? latestPosts : trendingPosts;

    return (
        <>
            <React.Fragment
                title="Protocol"
                children={
                    <div
                        className={clsx(
                            "flex flex-col w-full items-center p-4 bg-isSystemLightSecondary grow overflow-hidden",
                            MAX_WIDTH,
                        )}
                    >
                        <ForumNavigator
                            backUrl={backUrl}
                            forum={protocolForum}
                            backText="Protocols"
                            buttonText="Go to Forum"
                        />
                        <div
                            className={clsx(
                                "w-full overflow-y-auto grow !space-y-2 text-md hide-scrollbar mt-4",
                                ANIMATE,
                                MAX_WIDTH,
                            )}
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
                                {/* Forum Icon */}
                                <img
                                    src={protocolForum?.forum_icon}
                                    style={{
                                        width: "58px",
                                        height: "58px",
                                        borderRadius: "50%",
                                        objectFit: "cover",
                                        backgroundColor:
                                            protocolForum.background_color,
                                    }}
                                />
                                {/* Forum title and weekly summary text */}
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
                                        {protocolForum.forum_title}
                                    </h1>
                                    <p
                                        style={{
                                            fontSize: "15px",
                                            color: "#000",
                                        }}
                                    >
                                        {protocolForum.forum_weekly_summary &&
                                            protocolForum.forum_weekly_summary
                                                .split(". ")
                                                .slice(0, 1) + "."}
                                    </p>
                                </div>
                            </div>

                            <ForumStatsSummary
                                pastNDays={7}
                                posts={latestPosts}
                                classes="flex flex-row w-9/10 justify-center items-center pt-[24px]"
                            />

                            <div style={{ padding: "0px 0px 0px 10px" }}>
                                <Tabs
                                    activeDisplay={activeDisplay}
                                    setActiveDisplay={setActiveDisplay}
                                    primary_color={protocolForum.primary_color}
                                    options={[
                                        { text: "Latest", state: "latest" },
                                        { text: "Trending", state: "trending" },
                                    ]}
                                />
                            </div>

                            <div classes="w-9/10 justify-center items-center">
                                <div
                                    style={{
                                        padding: "0px 6px 0px 6px",
                                    }}
                                >
                                    {postsToShow.length > 0 ? (
                                        <Masonry
                                            breakpointCols={{
                                                default: 2,
                                            }}
                                            className="my-masonry-grid"
                                            columnClassName="my-masonry-grid_column"
                                        >
                                            {postsToShow.map((post) => (
                                                <PostPreview
                                                    forum={protocolForum}
                                                    post={post}
                                                    username={username}
                                                    chatid={chatid}
                                                />
                                            ))}
                                        </Masonry>
                                    ) : (
                                        "No latest posts available."
                                    )}
                                </div>
                            </div>
                        </div>
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
