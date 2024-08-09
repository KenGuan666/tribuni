import React from "react";
import Image from "next/image";

export const Reply = ({ post }) => {
    return (
        <React.Fragment>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "10px",
                }}
            >
                <Image
                    src={post.author_avatar}
                    height="32"
                    width="32"
                    layout="fixed"
                    style={{
                        borderRadius: "50%",
                        width: "32px",
                        height: "32px",
                    }}
                />
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <p
                        style={{
                            fontSize: "13px",
                            fontWeight: "500",
                            color: "#000",
                            marginBottom: "2px",
                        }}
                    >
                        {post.author_username}
                    </p>
                    <p
                        style={{
                            fontSize: "12px",
                            // fontWeight: "400",
                            color: "#8E8E8E",
                            wordBreak: "break-word",
                            overflowWrap: "break-word",
                        }}
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </div>
            </div>
        </React.Fragment>
    );
};
