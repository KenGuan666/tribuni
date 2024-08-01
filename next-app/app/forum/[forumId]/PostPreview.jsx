"use client";
import clsx from "clsx";
import { dateStringFromTimestamptz } from "@/utils/time";
import { useRouter } from "next/navigation";
import { PostStats } from "./PostStats";

export const PostPreview = ({ forum, tags, post, username, chatid }) => {
    const router = useRouter();
    const clickUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/forum/${forum.id}/${post.id}?username=${username}&chatid=${chatid}`;
    const displayedTags = tags.filter((t) => post.tags.includes(t.name));
    return (
        <button
            onClick={() => router.push(clickUrl)}
            style={{
                backgroundColor: "#fff",
                borderRadius: "10px",
                padding: "2px 12px 4px 16px",
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
                    marginBottom: "10px",
                }}
            >
                {dateStringFromTimestamptz(post.post_created_at)}
            </p>
            {displayedTags.map((tag) => (
                <div
                    className={clsx(
                        "px-2 mr-2 py-[0.5] font-medium tabular-nums",
                    )}
                    style={{
                        background: tag.backgroundColor,
                        fontSize: "11px",
                        color: tag.primaryColor,
                        textAlign: "center",
                        justifyContent: "center",
                        borderRadius: "20px",
                        display: "flex",
                        flexDirection: "row",
                    }}
                >
                    {tag.emoji}
                    {tag.name}
                </div>
            ))}
            <h1
                style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#000",
                    marginTop: "8px",
                }}
            >
                {post.title}
            </h1>
            <PostStats post={post} />
        </button>
    );
};
