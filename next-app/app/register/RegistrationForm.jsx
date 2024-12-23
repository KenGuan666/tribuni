"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
// import { toast } from "sonner";
import toast from "react-hot-toast";
import clsx from "clsx";
import { ANIMATE, MAX_WIDTH, TOAST_BASE } from "@/components/constants";
import { ChevronForwardCircleFill } from "@/components/ios";
import { useSearchParams } from "next/navigation";
import { AccountCircle, VerifiedUser } from "@/components/material-rounded";
import { CheckCircle } from "@/components/material-rounded/CheckCircle";
import { Spinner } from "@/components/loaders";
import { fetchUserData } from "@/components/db/user";
import { RegisterUser } from "./RegisterUser";
import { redirect } from "next/navigation";
import { useStore } from "@/store";

const RegistrationFormPage = () => {
    const router = useRouter();
    const params = useSearchParams();

    const { refreshUser, setRefreshUser } = useStore();

    const username = params.get("username");
    const chatid = params.get("chatid");

    const [status, setStatus] = useState("NONE");
    const [doesUserExist, setUserExist] = useState(false);

    const INPUT_CONTAINER = clsx(
        "outline-none focus:outline-none font-500 px-2 py-2 leading-tight w-full border-2 border-isSystemLightSecondary focus-within:border-isBlueLight rounded-xl bg-isSystemLightSecondary flex flex-row space-x-2 items-center text-base",
        ANIMATE,
    );

    const INPUT_ICON = clsx("w-6 h-6 fill-isLabelLightSecondary");
    const INPUT = clsx(
        "outline-none focus:outline-none font-400 text-isLabelLightPrimary bg-transparent grow truncate text-ellipsis",
        ANIMATE,
    );

    const checkUserExists = async () => {
        try {
            const userData = await fetchUserData(username, chatid);

            if (userData != null) {
                setUserExist(true);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        checkUserExists();
    }, []);

    const redirectExistingUser = () => {
        if (doesUserExist === true) {
            setStatus("REDIRECTING");
            router.push(`/protocols?username=${username}&chatid=${chatid}`);
        }
    };

    useEffect(() => {
        redirectExistingUser();
    }, [doesUserExist]);

    return (
        <form
            id="register"
            onSubmit={async (e) => {
                e.preventDefault();

                let res = await RegisterUser({
                    username: username,
                    chatid: chatid,
                });

                if (res.code === 201) {
                    setStatus("REDIRECTING");

                    toast.success("Registration successful.");

                    setUserExist(true);
                    setRefreshUser(!refreshUser);
                } else {
                    toast.error(
                        "Something went wrong. Please contact support team at https://t.me/+GQxcYz_80B40ZGMx",
                    );
                }

                setStatus("NONE");
            }}
            className={clsx(
                "flex flex-col items-center w-full mt-8 place-content-center px-2 overflow-hidden",
            )}
        >
            <div
                className={clsx(
                    "w-full flex flex-col space-y-3 mt-4",
                    MAX_WIDTH,
                )}
            >
                <div className={INPUT_CONTAINER}>
                    <AccountCircle classes={clsx(INPUT_ICON)} />

                    <div className={INPUT}>{username}</div>

                    <CheckCircle
                        classes={clsx("w-5 h-5 fill-isGreenLight rounded-full")}
                    />
                </div>

                <button
                    id="submit"
                    type="submit"
                    onClick={() => {
                        setStatus("REGISTERING");
                    }}
                    className={clsx(
                        "!mt-8 text-center w-full bg-isBlueLight rounded-xl text-isWhite font-500 hover:bg-isBlueLightEmphasis h-10 flex flex-row items-center place-content-center",
                        ANIMATE,
                    )}
                >
                    {status === "REGISTERING" && <Spinner />}

                    {status === "NONE" && "Register"}
                    {status === "NONE" && (
                        <ChevronForwardCircleFill
                            classes={clsx(
                                "w-6 h-6 ml-[0.1rem] fill-isWhite shrink-0",
                            )}
                        />
                    )}

                    {status === "REDIRECTING" && "Redirecting..."}
                </button>
            </div>
        </form>
    );
};

export const RegistrationForm = () => (
    <Suspense fallback={<div>Loading...</div>}>
        <RegistrationFormPage />
    </Suspense>
);
