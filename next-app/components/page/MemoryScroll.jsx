import React, { useEffect, useRef } from "react";
import clsx from "clsx";
import { useStore } from "@/store";

export const MemoryScroll = ({ protocolId, children, classes }) => {
    const containerRef = useRef(null);
    const { getForumScroll, setForumScroll } = useStore();

    // Restore scroll position on mount
    useEffect(() => {
        const savedScrollPosition = getForumScroll(protocolId);
        if (savedScrollPosition && containerRef.current) {
            containerRef.current.scrollTop = parseInt(savedScrollPosition, 10);
        }

        const handleScroll = () => {
            if (containerRef.current) {
                setForumScroll(protocolId, containerRef.current.scrollTop);
            }
        };

        const container = containerRef.current;
        container.addEventListener("scroll", handleScroll);

        // Cleanup on unmount
        return () => {
            container.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className={clsx(
                "overflow-y-auto hide-scrollbar",
                "touch-pan-y",
                classes,
            )}
        >
            {children}
        </div>
    );
};
