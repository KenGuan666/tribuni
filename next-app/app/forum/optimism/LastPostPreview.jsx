import React from "react";
import Image from "next/image";
import { htmlToPlaintext, trimLength } from "@/utils/text";

export const LastPostPreview = ({ topic, post }) => {
    const content = post?.content ? post.content : topic.summary;
    return (
        <React.Fragment>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "10px",
                    alignItems: "center",
                }}
            >
                <Image
                    src={post.author_avatar}
                    height="24"
                    width="24"
                    layout="fixed"
                    style={{
                        borderRadius: "50%",
                    }}
                />
                <p
                    style={{
                        fontSize: "12px",
                        fontWeight: "400",
                        color: "#000",
                    }}
                >
                    {post.author_username}
                </p>
            </div>
            <div
                style={{
                    paddingTop: "5px",
                    fontSize: "11px",
                    fontWeight: "350",
                    color: "#8E8E8E",
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                }}
            >
                {trimLength(htmlToPlaintext(content), 90)}
            </div>
        </React.Fragment>
    );
};
