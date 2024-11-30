"use client";
import clsx from "clsx";
import React, { useState, useEffect } from "react";
import { ANIMATE, MAX_WIDTH } from "@/components/constants";
import { fetchForumByProtocol } from "@/components/db/forum";
import {
    fetchLatestTopics,
    fetchForumCategories,
    fetchPosts,
} from "@/components/db/forum";
import { ForumNavigator } from "./ForumNavigator";
import { Spinner } from "@/components/loaders";
import { MemoryScroll } from "@/components/page/MemoryScroll";
import { useStore } from "@/store";
import { isLessThanNDaysAgo } from "@/utils/time";
import Masonry from "react-masonry-css";
import { ForumStatsSummary } from "./ForumStatsSummary";
import { TopicPreview } from "./TopicPreview";
import { Tabs } from "./Tabs";

export default function Page({ params, searchParams }) {
    const { username, chatid, from } = searchParams;
    const { protocolId } = params;

    let {
        getCachedTopics,
        cacheTopics,
        getCachedForum,
        cacheForum,
        getCachedForumCategories,
        cacheForumCategories,
        forumTab,
        setForumTab,
    } = useStore();

    const [forum, setForum] = useState(getCachedForum(protocolId));
    const [categories, setCategories] = useState(
        getCachedForumCategories(protocolId),
    );
    const [trendingTopics, setTrendingTopics] = useState(null);
    const [latestTopics, setLatestTopics] = useState(null);

    let topicsToShow = null;

    useEffect(() => {
        const getProtocolInfo = async () => {
            try {
                if (!forum) {
                    const forum = await fetchForumByProtocol(protocolId);
                    setForum(forum);
                    cacheForum(protocolId, forum);
                }

                if (!categories) {
                    const categories = await fetchForumCategories(protocolId);
                    const categoriesById = categories.reduce((m, c) => {
                        m[c.id] = c;
                        return m;
                    }, {});
                    setCategories(categoriesById);
                    cacheForumCategories(protocolId, categoriesById);
                }

                // TODO: implement as infinite-scroll
                const cachedTopics = getCachedTopics(protocolId);
                if (cachedTopics.size > 5) {
                    let latestTopics = Array.from(cachedTopics.values());
                    setLatestTopics(latestTopics);

                    let trendingTopics = [...latestTopics];
                    trendingTopics.sort(
                        (a, b) => trendingMetric(b) - trendingMetric(a),
                    );
                    // TODO: implement as infinite-scroll
                    setTrendingTopics(trendingTopics);
                    return;
                }

                const latestTopicsDb = await fetchLatestTopics(protocolId);
                const postsDb = await fetchPosts(protocolId);

                // create topic.posts field for each topic
                const postsByTopicId = postsDb.reduce((map, post) => {
                    if (!map[post.topic_id]) {
                        map[post.topic_id] = [];
                    }
                    map[post.topic_id].push(post);
                    return map;
                }, {});
                const latestTopics = latestTopicsDb
                    .map((t) => {
                        const posts = postsByTopicId[t.id];
                        t.posts = posts
                            ? posts.sort(
                                  (a, b) => a.post_number - b.post_number,
                              )
                            : [];
                        return t;
                    })
                    .filter((t) => t.posts);
                setLatestTopics(latestTopics);
                cacheTopics(protocolId, latestTopics);

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
    topicsToShow = forumTab === "latest" ? latestTopics : trendingTopics;

    return (
        <>
            <React.Fragment
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
                            url={forum.forum_url}
                            backText="Protocols"
                            buttonText="Go to Forum"
                        />
                        <MemoryScroll
                            classes="!space-y-2 text-md mt-4 w-full"
                            protocolId={protocolId}
                            children={
                                <div
                                    className={clsx(
                                        "w-full overflow-y-auto !space-y-2 text-md hide-scrollbar mt-4",
                                        "touch-pan-y",
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
                                        protocolId={protocolId}
                                        pastNDays={7}
                                        topics={latestTopics}
                                        classes="flex flex-row w-9/10 justify-center items-center pt-[24px]"
                                    />

                                    <div
                                        style={{ padding: "0px 0px 0px 10px" }}
                                    >
                                        <Tabs
                                            activeDisplay={forumTab}
                                            setActiveDisplay={setForumTab}
                                            primary_color={forum.primary_color}
                                            options={[
                                                {
                                                    text: "Latest",
                                                    state: "latest",
                                                },
                                                {
                                                    text: "Trending",
                                                    state: "trending",
                                                },
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
                                                    {topicsToShow.map(
                                                        (topic) => (
                                                            <TopicPreview
                                                                category={
                                                                    categories[
                                                                        topic
                                                                            .category_id
                                                                    ]
                                                                }
                                                                topic={topic}
                                                                username={
                                                                    username
                                                                }
                                                                chatid={chatid}
                                                                showPost={
                                                                    forumTab ==
                                                                    "latest"
                                                                }
                                                                protocolId={
                                                                    protocolId
                                                                }
                                                            />
                                                        ),
                                                    )}
                                                </Masonry>
                                            ) : (
                                                "No latest posts available."
                                            )}
                                        </div>
                                    </div>
                                </div>
                            }
                        />
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
    const recentPostCount = topic.posts.filter((p) =>
        isLessThanNDaysAgo(p.created_at, 7),
    ).length;
    return 8 * recentPostCount + 5 * topic.post_count + 2 * topic.like_count;
}
