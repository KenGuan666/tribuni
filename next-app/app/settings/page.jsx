"use client";
import { PageLoader } from "@/components/loaders";
import { UserConnector } from "@/components/Connectors";
import { BASE_USER, MAX_WIDTH } from "@/components/constants";
import clsx from "clsx";
import { Settings } from "@/components/user/Settings";
import { useStore } from "@/store";

export default function Page() {
    const { user } = useStore();
    return (
        <PageLoader
            children={
                <div
                    className={clsx(
                        "flex flex-col items-center w-full grow overflow-y-scroll hide-scrollbar pb-2 bg-isSystemLightSecondary",
                        MAX_WIDTH,
                    )}
                >
                    {user !== BASE_USER && <Settings />}
                    <UserConnector />
                </div>
            }
        />
    );
}
