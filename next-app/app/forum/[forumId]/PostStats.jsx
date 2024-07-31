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

export const PostStats = ({ post }) => {
    const views = <IconAndCount icon={ViewsIcon.src} count={post.num_views} />;
    const comments = (
        <IconAndCount icon={CommentsIcon.src} count={post.num_comments} />
    );
    const likes = <IconAndCount icon={LikesIcon.src} count={post.num_likes} />;

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
