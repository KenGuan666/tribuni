import CommentsIcon from "@/public/assets/comments.png";
import LikesIcon from "@/public/assets/likes.png";
import OptimisticIcon from "@/public/assets/op_star_upright.png";
import Image from "next/image";
import { calculateSentimentScore } from "./[topicId]/Sentiment";

const IconAndCount = ({ icon, count }) => {
    return (
        <p
            style={{
                display: "flex",
                flexDirection: "row",
                color: "#A2A2AE",
                justifyContent: "center",
                alignItems: "center",
                marginRight: "10px",
            }}
        >
            <Image
                src={icon}
                width={10}
                height={10}
                style={{
                    height: "10px",
                    width: "10px",
                    marginRight: "5px",
                }}
            />
            {count}
        </p>
    );
};

export const TopicStats = ({ topic }) => {
    const comments = (
        <IconAndCount icon={CommentsIcon.src} count={topic.post_count - 1} />
    );
    const likes = (
        <IconAndCount icon={LikesIcon.src} count={topic.like_count} />
    );
    const sentimentScore = calculateSentimentScore(topic);
    const sentiments = isNaN(sentimentScore) ? null : (
        <IconAndCount icon={OptimisticIcon.src} count={`${sentimentScore}%`} />
    );

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "10px",
                color: "#A2A2AE",
                fontSize: "12px",
                marginBottom: "10px",
                marginRight: "10px",
            }}
        >
            {likes}
            {comments}
            {sentiments}
        </div>
    );
};
