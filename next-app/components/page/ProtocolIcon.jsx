"use client";

import Image from "next/image";

const gradients = [
    "linear-gradient(45deg, #ff6a00 0%, #ee0979 100%)", // fiery orange to magenta
    "linear-gradient(45deg, #36d1dc 0%, #5b86e5 100%)", // turquoise to blue
    "linear-gradient(45deg, #ff9a9e 0%, #fecfef 100%)", // soft pink to pale rose
    "linear-gradient(45deg, #a1c4fd 0%, #c2e9fb 100%)", // light blue to lighter blue
    "linear-gradient(45deg, #667eea 0%, #764ba2 100%)", // purple to darker purple
    "linear-gradient(45deg, #e0c3fc 0%, #8ec5fc 100%)", // lavender to light blue
    "linear-gradient(45deg, #ffecd2 0%, #fcb69f 100%)", // peach to coral
    "linear-gradient(45deg, #43e97b 0%, #38f9d7 100%)", // green to teal
];

const getGradient = (seed) => {
    return gradients[seed % gradients.length];
};

const getSeedFromStr = (str) => {
    if (!str) {
        return 0;
    }
    return str.charCodeAt(0);
};

export const ProtocolIcon = ({ protocol, fill, size }) => {
    if (protocol.icon) {
        if (fill) {
            return (
                <Image
                    src={protocol.icon}
                    fill
                    layout="fixed"
                    style={{
                        borderRadius: "50%",
                    }}
                />
            );
        }
        return (
            <Image
                src={protocol.icon}
                width={size}
                height={size}
                layout="fixed"
                style={{
                    borderRadius: "50%",
                }}
            />
        );
    }
    const seed = getSeedFromStr(protocol.name);
    return (
        <div
            style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: getGradient(seed),
            }}
        />
    );
};
