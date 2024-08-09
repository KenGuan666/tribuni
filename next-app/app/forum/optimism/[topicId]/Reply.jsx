import React from "react";
import Image from "next/image";
import { htmlToPlaintext } from "@/utils/text";
import { dateStringFromTimestamptz } from "@/utils/time";

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
                        width: "100%",
                        marginRight: "12px",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            marginBottom: "6px",
                        }}
                    >
                        <p
                            style={{
                                fontSize: "14px",
                                fontWeight: "500",
                                color: "#000",
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            {post.author_username}
                        </p>
                        <p
                            style={{
                                fontSize: "14px",
                                fontWeight: "350",
                                color: "#8E8E8E",
                                display: "flex",
                                alignItems: "center",
                                marginLeft: "auto",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {dateStringFromTimestamptz(post.created_at)}
                        </p>
                    </div>

                    <p
                        style={{
                            fontSize: "12px",
                            color: "#8E8E8E",
                            wordBreak: "break-word",
                            overflowWrap: "break-word",
                            maxWidth: "100%",
                        }}
                        dangerouslySetInnerHTML={{
                            __html: htmlToPlaintext(post.content).replace(
                                /\n/g,
                                "<span style='display: block; line-height: 0.6em;'>&nbsp;</span>",
                            ),
                        }}
                    />
                </div>
            </div>
        </React.Fragment>
    );
};
