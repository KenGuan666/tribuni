import React, { useEffect, useRef } from "react";
import clsx from "clsx";

export const MemoryScroll = ({ children, uniqueKey, classes }) => {
    const containerRef = useRef(null);

    // Restore scroll position on mount
    useEffect(() => {
        const savedScrollPosition = localStorage.getItem(
            `scrollPosition-${uniqueKey}`,
        );
        if (savedScrollPosition && containerRef.current) {
            containerRef.current.scrollTop = parseInt(savedScrollPosition, 10);
        }

        const handleScroll = () => {
            if (containerRef.current) {
                localStorage.setItem(
                    `scrollPosition-${uniqueKey}`,
                    containerRef.current.scrollTop,
                );
            }
        };

        const container = containerRef.current;
        container.addEventListener("scroll", handleScroll);

        // Cleanup on unmount
        return () => {
            container.removeEventListener("scroll", handleScroll);
        };
    }, [uniqueKey]);

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
