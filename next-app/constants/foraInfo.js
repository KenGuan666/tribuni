import { colors } from "./tagColors";

export const foraInfo = {
    optimism: {
        url: "https://gov.optimism.io",
        name: "Optimistic Digest",
        primaryColor: "rgba(255, 0, 0, 1)",
        backgroundColor: "rgba(255, 0, 0, 0.1)",
        icon: "https://tribuni.s3.amazonaws.com/op-forum-logo.png",
        tags: [
            {
                name: "Get Started",
                emoji: "🗳️",
            },
            {
                name: "Mission Grants",
                emoji: "🎯",
            },
            {
                name: "Delegates",
                emoji: "👥",
            },
            {
                name: "Retro Funding",
                emoji: "💸",
            },
            {
                name: "Citizens",
                emoji: "👩‍👦",
            },
            {
                name: "Elected Representatives",
                emoji: "👩‍💼",
            },
            {
                name: "Technical Proposals",
                emoji: "🔧",
            },
            {
                name: "Policies and Templates",
                emoji: "📜",
            },
            {
                name: "Collective Strategy",
                emoji: "🎯",
            },
            {
                name: "Updates and Announcements",
                emoji: "📢",
            },
            {
                name: "Governance Design",
                emoji: "🏛️",
            },
            {
                name: "Feedback",
                emoji: "📝",
            },
            {
                name: "Accountability",
                emoji: "🔍",
            },
            {
                name: "General Discussions",
                emoji: "🗣️",
            },
        ].map((tag, idx) => {
            const color = colors[idx % colors.length];
            tag.primaryColor = color;
            tag.backgroundColor = `${color}1A`;
            return tag;
        }),
    },
};
