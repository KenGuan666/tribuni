import Image from "next/image";
import { dateStringFromTimestamptz } from "@/utils/time";

export const Author = ({ topic }) => {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                gap: "10px",
                alignItems: "center",
            }}
        >
            <Image
                src={topic.author_avatar}
                height="52"
                width="52"
                layout="fixed"
                style={{
                    borderRadius: "50%",
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
                        fontSize: "16px",
                        fontWeight: "600",
                        color: "#000",
                    }}
                >
                    {topic.author_username}
                </p>
                <p
                    style={{
                        fontSize: "12px",
                        fontWeight: "400",
                        color: "rgba(0, 0, 0, 0.5)",
                        display: "flex",
                        flexDirection: "row",
                        gap: "5px",
                    }}
                >
                    {`Created on ${dateStringFromTimestamptz(topic.created_at)}`}
                </p>
            </div>
        </div>
    );
};
