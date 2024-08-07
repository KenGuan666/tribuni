"use client";
import clsx from "clsx";
import React, { useState, useEffect } from "react";
import { ANIMATE, MAX_WIDTH } from "@/components/constants";
import { fetchForumById } from "@/components/db/forum";
import {
    fetchLatestOPTopics,
    fetchOPForumCategories,
    fetchOPPosts,
} from "@/components/db/op_forum";
import { ForumNavigator } from "./ForumNavigator";
import { foraInfo } from "@/constants/foraInfo";
import { Spinner } from "@/components/loaders";
import Masonry from "react-masonry-css";
import { ForumStatsSummary } from "./ForumStatsSummary";
import { TopicPreview } from "./TopicPreview";
import { Tabs } from "./Tabs";

const forumId = 1;

export default function Page({ searchParams }) {
    const { username, chatid, from } = searchParams;
    const [forum, setForum] = useState(null);
    const [trendingTopics, setTrendingTopics] = useState(null);
    const [activeDisplay, setActiveDisplay] = useState("latest");
    const [latestTopics, setLatestTopics] = useState(null);
    const [categories, setCategories] = useState(null);

    let topicsToShow = null;

    useEffect(() => {
        const getProtocolInfo = async () => {
            try {
                const forum = await fetchForumById(forumId);
                setForum(forum);

                // TODO: implement as infinite-scroll
                const latestTopicsDb = await fetchLatestOPTopics();
                const postsDb = await fetchOPPosts();
                const categories = await fetchOPForumCategories();
                const categoriesById = categories.reduce((m, c) => {
                    m[c.id] = c;
                    return m;
                }, {});
                setCategories(categoriesById);

                // create topic.posts field for each topic
                const postsByTopicId = postsDb.reduce((map, post) => {
                    if (!map[post.topic_id]) {
                        map[post.topic_id] = [];
                    }
                    map[post.topic_id].push(post);
                    return map;
                }, {});
                const latestTopics = latestTopicsDb.map((t) => {
                    const posts = postsByTopicId[t.id];
                    t.posts = posts
                        ? posts.sort((a, b) => a.post_number - b.post_number)
                        : [];
                    return t;
                });
                setLatestTopics(latestTopics);

                let trendingTopics = [...latestTopics];
                trendingTopics.sort(
                    (a, b) => trendingMetric(b) - trendingMetric(a),
                );
                // TODO: implement as infinite-scroll
                setTrendingTopics(trendingTopics);
            } catch (error) {
                console.error(error);
            }
        };
        getProtocolInfo();
    }, []);

    if (!forum || !trendingTopics || !trendingTopics || !categories) {
        return <Spinner />;
    }

    // Ignore "from" parameter for now, and always send user back to protocols page
    const backUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/protocols?username=${username}&chatid=${chatid}`;
    topicsToShow = activeDisplay === "latest" ? latestTopics : trendingTopics;

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
                            forum={forum}
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
                                    src={forum.forum_icon}
                                    style={{
                                        width: "58px",
                                        height: "58px",
                                        borderRadius: "50%",
                                        objectFit: "cover",
                                        backgroundColor: forum.background_color,
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
                                        {forum.forum_title}
                                    </h1>
                                    <p
                                        style={{
                                            fontSize: "15px",
                                            color: "#000",
                                        }}
                                    >
                                        {forum.forum_weekly_summary &&
                                            forum.forum_weekly_summary
                                                .split(". ")
                                                .slice(0, 1) + "."}
                                    </p>
                                </div>
                            </div>

                            <ForumStatsSummary
                                pastNDays={7}
                                topics={latestTopics}
                                classes="flex flex-row w-9/10 justify-center items-center pt-[24px]"
                            />

                            <div style={{ padding: "0px 0px 0px 10px" }}>
                                <Tabs
                                    activeDisplay={activeDisplay}
                                    setActiveDisplay={setActiveDisplay}
                                    primary_color={forum.primary_color}
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
                                    {topicsToShow.length > 0 ? (
                                        <Masonry
                                            breakpointCols={{
                                                default: 2,
                                            }}
                                            className="my-masonry-grid"
                                            columnClassName="my-masonry-grid_column"
                                        >
                                            {topicsToShow.map((topic) => (
                                                <TopicPreview
                                                    categories={categories}
                                                    topic={topic}
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

function trendingMetric(topic) {
    return 5 * topic.post_count + 2 * topic.like_count;
}
