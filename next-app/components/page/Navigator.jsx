"use client";
import clsx from "clsx";
import Link from "next/link";
import { ANIMATE, MAX_WIDTH } from "@/components/constants";
import { Spinner } from "@/components/loaders";

export const Navigator = ({ text, link }) => {
    return (
        <div
            className={clsx(
                "flex flex-col items-start w-full group",
                ANIMATE,
                MAX_WIDTH,
            )}
        >
            <Link
                href={link}
                className={clsx(
                    "flex flex-row items-center space-x-0",
                    ANIMATE,
                )}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className={clsx(
                        "w-6 h-6 fill-isBlueLight stroke-isBlueLight",
                        ANIMATE,
                    )}
                >
                    <path
                        fillRule="evenodd"
                        d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z"
                        clipRule="evenodd"
                    />
                </svg>

                <div
                    className={clsx(
                        "text-sm text-isBlueLight font-500",
                        ANIMATE,
                    )}
                >
                    {text}
                </div>
            </Link>
        </div>
    );
};
