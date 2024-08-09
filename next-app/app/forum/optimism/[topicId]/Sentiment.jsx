import React from "react";

export const Sentiment = ({ score, color }) => {
    return (
        <React.Fragment>
            <p
                style={{
                    color: "#8E8E8E",
                    fontSize: "13px",
                    marginLeft: "20px",
                    width: "80%",
                    alignItems: "left",
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
                    {score}%
                </span>
                of replies expressed optimistic feelings towards this post
            </p>
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
                            width: `${score}%`,
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
