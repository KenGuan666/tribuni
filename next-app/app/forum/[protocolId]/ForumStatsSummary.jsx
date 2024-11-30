import { isLessThanNDaysAgo } from "@/utils/time";
import clsx from "clsx";
import Image from "next/image";
import OpStar from "@/public/assets/op_star.png";
import CompStar from "@/public/assets/comp_star.png";

var styleByProtocol = {
    optimism: [["#F9F1E9", "#E9F0F9", "#F2ADB1"], OpStar],
    compound: [["#F9F1E9", "#E9F0F9", "#B9FFB9"], CompStar],
};

export const ForumStatsSummary = ({
    protocolId,
    pastNDays,
    topics,
    classes,
}) => {
    const newTopics = topics.filter((t) =>
        isLessThanNDaysAgo(t.created_at, pastNDays),
    );
    const numTopics = newTopics.length;
    const numLikes = newTopics.reduce((s, t) => s + t.like_count, 0);
    const numPosts = topics.reduce(
        (s, t) =>
            s +
            t.posts.filter((p) => isLessThanNDaysAgo(p.created_at, pastNDays))
                .length,
        0,
    );

    let [complimentaryColors, decorativeImg] = styleByProtocol[protocolId];

    return (
        <div className={clsx(classes, "relative")}>
            <ForumStatsSummaryBlock
                number={numTopics}
                text="new topics"
                width="34%"
                gradientColor={complimentaryColors[0]}
            />
            <ForumStatsSummaryBlock
                number={numPosts - numTopics}
                text="new replies"
                width="32%"
                gradientColor={complimentaryColors[1]}
            />
            <ForumStatsSummaryBlock
                number={numLikes}
                text="likes"
                width="27%"
                gradientColor={complimentaryColors[2]}
            />
            <Image
                src={decorativeImg}
                className="absolute w-[40px] h-[40px] bottom-[-18px] right-[-1px] transform rotate-4 z-20"
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
