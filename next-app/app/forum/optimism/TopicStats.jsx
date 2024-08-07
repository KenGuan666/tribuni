import CommentsIcon from "@/public/assets/comments.png";
import ViewsIcon from "@/public/assets/views.png";
import LikesIcon from "@/public/assets/likes.png";

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
            <img
                src={icon}
                style={{
                    height: "10px",
                    marginRight: "5px",
                }}
            />
            {count}
        </p>
    );
};

export const TopicStats = ({ topic }) => {
    const comments = (
        <IconAndCount icon={CommentsIcon.src} count={topic.post_count} />
    );
    const likes = (
        <IconAndCount icon={LikesIcon.src} count={topic.like_count} />
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
            {/* {views} */}
        </div>
    );
};
