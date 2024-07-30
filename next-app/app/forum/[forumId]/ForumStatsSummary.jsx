import { secondsFromNow } from "@/utils/time";
import clsx from "clsx";

export const ForumStatsSummary = ({ pastNDays, posts, classes }) => {
    const oneDay = 24 * 60 * 60;
    const isRecentFn = (post) =>
        secondsFromNow(new Date(post.post_created_at).getTime() / 1000) >
        -oneDay * pastNDays;

    let numPosts = 0,
        numComments = 0,
        numLikes = 0;
    posts.forEach((post) => {
        if (isRecentFn(post)) {
            numPosts += 1;
            numComments += post.num_comments;
            numLikes += post.num_likes;
        }
    });

    return (
        <div className={classes}>
            <ForumStatsSummaryBlock
                number={numPosts}
                text="new posts"
                width="34%"
                gradientColor="#F9F1E9"
            />
            <ForumStatsSummaryBlock
                number={numComments}
                text="replies"
                width="32%"
                gradientColor="#E9F0F9"
            />
            <ForumStatsSummaryBlock
                number={numLikes}
                text="likes"
                width="27%"
                gradientColor="#F2ADB1"
            />
        </div>
    );
};

const ForumStatsSummaryBlock = ({ number, text, width, gradientColor }) => {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
                height: "75px",
                width: `${width}`,
                marginRight: "3px",
                marginLeft: "3px",
                padding: "12px 16px",
                borderRadius: "8px",
                backgroundImage: `linear-gradient(45deg, #FFFFFF 0%, ${gradientColor} 100%)`,
            }}
        >
            <h1
                style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#000",
                }}
            >
                {number}
            </h1>
            <p
                style={{
                    fontSize: "13px",
                    color: "#000",
                }}
            >
                {text}
            </p>
        </div>
    );
};
