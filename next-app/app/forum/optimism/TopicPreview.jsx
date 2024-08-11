"use client";
import clsx from "clsx";
import { dateStringFromTimestamptz } from "@/utils/time";
import { useRouter } from "next/navigation";
import { TopicStats } from "./TopicStats";
import { LastPostPreview } from "./LastPostPreview";

export const TopicPreview = ({
    category,
    topic,
    username,
    chatid,
    showPost,
}) => {
    const router = useRouter();
    const clickUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/forum/optimism/${topic.id}?username=${username}&chatid=${chatid}`;
    return (
        <button
            onClick={() => router.push(clickUrl)}
            style={{
                backgroundColor: "#fff",
                borderRadius: "10px",
                padding: "2px 8px 4px 16px",
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
                    marginBottom: "6px",
                }}
            >
                {dateStringFromTimestamptz(topic.last_posted_at)}
            </p>
            <div
                className={clsx("px-2 mr-1 py-[0.9] font-medium tabular-nums")}
                style={{
                    background: `#${category.color}1A`,
                    fontSize: `${category.font_size}px`,
                    color: `#${category.color}`,
                    textAlign: "center",
                    justifyContent: "center",
                    borderRadius: "14px",
                    display: "flex",
                    flexDirection: "row",
                }}
            >
                {category.name}
            </div>
            <h1
                style={{
                    fontSize: "15px",
                    fontWeight: "600",
                    color: "#000",
                    marginTop: "4px",
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                }}
            >
                {topic.title}
            </h1>
            {showPost && (
                <div class="mt-2">
                    <LastPostPreview
                        topic={topic}
                        post={topic.posts.reduce((latest, p) => {
                            return p.post_number > latest.post_number
                                ? p
                                : latest;
                        }, topic.posts[0])}
                    />
                </div>
            )}
            <TopicStats topic={topic} />
        </button>
    );
};
