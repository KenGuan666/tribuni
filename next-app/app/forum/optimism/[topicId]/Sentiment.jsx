import React from "react";
import Image from "next/image";
import OpStar from "@/public/assets/op_star_upright.png";

export const Sentiment = ({ topic, color }) => {
    const sentimentScore = calculateSentimentScore(topic);
    if (isNaN(sentimentScore)) return null;
    return (
        <React.Fragment>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    marginLeft: "20px",
                }}
            >
                <div
                    style={{
                        marginTop: "2px",
                    }}
                >
                    <Image src={OpStar} className="w-[20px] h-[20px]" />
                </div>
                <p
                    style={{
                        color: "#8E8E8E",
                        fontSize: "13px",
                        width: "80%",
                        alignItems: "left",
                        marginLeft: "8px",
                    }}
                >
                    <span
                        style={{
                            color: "#000",
                            fontWeight: 600,
                            fontSize: "16px",
                            marginRight: "8px",
                        }}
                    >
                        {sentimentScore}%
                    </span>
                    of replies expressed optimistic feelings towards this post
                </p>
            </div>

            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "10px",
                }}
            >
                <div
                    style={{
                        width: "88%",
                        height: "12px",
                        backgroundColor: "#E8E8E8",
                        borderRadius: "15px",
                        overflow: "hidden",
                        position: "relative",
                    }}
                >
                    <div
                        style={{
                            width: `${sentimentScore}%`,
                            backgroundColor: color,
                            height: "100%",
                            borderRadius: "15px 15px 15px 15px",
                            transition: "width 0.3s ease-in-out",
                        }}
                    />
                </div>
            </div>
        </React.Fragment>
    );
};

export function calculateSentimentScore(topic) {
    const nonAuthorPosts = topic.posts.filter(
        (p) => p.author_username != topic.author_username && p.content,
    );
    const positivePostCount = nonAuthorPosts.reduce((s, p) => {
        if (p.is_sentiment_positive) {
            s += 1;
        }
        return s;
    }, 0);
    return ((positivePostCount * 1.0) / nonAuthorPosts.length).toFixed(2) * 100;
}
