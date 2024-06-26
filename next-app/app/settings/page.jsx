"use client";
import clsx from "clsx";
import { useEffect } from "react";
import { fetchUserData } from "@/components/db/user";
import { UserConnector } from "@/components/Connectors";
import { BASE_USER, MAX_WIDTH } from "@/components/constants";
import { PageLoader } from "@/components/loaders";
import { useStore } from "@/store";
import { Settings } from "./Settings";

export default function Page({ searchParams }) {
    let { user, setUser } = useStore();
    const { username, chatid } = searchParams;
    const fetchData = async () => {
        // Setting page is an entry point. It must be able to load user from params
        if (user == BASE_USER) {
            try {
                const userData = await fetchUserData(username, chatid);
                setUser(userData);
            } catch (err) {
                console.log(err);
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <PageLoader
            children={
                <div
                    className={clsx(
                        "flex flex-col items-center w-full grow overflow-y-scroll hide-scrollbar pb-2 bg-isSystemLightSecondary",
                        MAX_WIDTH,
                    )}
                >
                    <Settings />
                    <UserConnector />
                </div>
            }
        />
    );
}
