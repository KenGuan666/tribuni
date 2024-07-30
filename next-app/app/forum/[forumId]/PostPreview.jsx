import { dateStringFromTimestamptz } from "@/utils/time";
import { useRouter } from "next/navigation";
import { PostStats } from "./PostStats";

export const PostPreview = ({ forum, post, username, chatid }) => {
    const router = useRouter();
    const clickUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/forum/${forum.id}/${post.id}?username=${username}&chatid=${chatid}`;
    return (
        <button
            onClick={() => router.push(clickUrl)}
            style={{
                backgroundColor: "#fff",
                borderRadius: "10px",
                padding: "10px 11px 4px 18px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
                textAlign: "left",
                marginBottom: "8px",
                maxWidth: "175px",
            }}
        >
            <p
                style={{
                    fontSize: "12px",
                    color: "#A2A2AE",
                    marginTop: "10px",
                }}
            >
                {dateStringFromTimestamptz(post.post_created_at)}
            </p>
            <div
                style={{
                    marginTop: "10px",
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "flex-start",
                }}
            >
                {" "}
            </div>
            <h1
                style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#000",
                    marginTop: "6px",
                }}
            >
                {post.title}
            </h1>
            <PostStats post={post} />
        </button>
    );
};
