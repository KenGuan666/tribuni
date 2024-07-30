import CommentsIcon from "@/public/assets/comments.png";
import ViewsIcon from "@/public/assets/views.png";

export const PostStats = ({ post }) => {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "10px",
                color: "#A2A2AE",
                fontSize: "13px",
                marginBottom: "10px",
                marginRight: "10px",
            }}
        >
            <p
                style={{
                    display: "flex",
                    flexDirection: "row",
                    fontSize: "13px",
                    color: "#A2A2AE",
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: "10px",
                }}
            >
                <img
                    src={ViewsIcon.src}
                    style={{
                        height: "10px",
                        marginRight: "5px",
                    }}
                />
                {post.num_views}
            </p>

            <p
                style={{
                    display: "flex",
                    flexDirection: "row",
                    fontSize: "13px",
                    color: "#A2A2AE",
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: "10px",
                }}
            >
                <img
                    src={CommentsIcon.src}
                    style={{
                        height: "10px",
                        marginRight: "5px",
                    }}
                />
                {post.num_comments}
            </p>
        </div>
    );
};
