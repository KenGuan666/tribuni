"use client";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { fetchUserData } from "@/components/db/user";
import { UserConnector } from "@/components/Connectors";
import { BASE_USER, MAX_WIDTH } from "@/components/constants";
import { PageLoader, Spinner } from "@/components/loaders";
import { SearchBar } from "@/components/page";
import { Title } from "@/components/ui/page";
import { useStore } from "@/store";
import { ForumList } from "./ForumList";
import axios from "axios";

export default function Page({ searchParams }) {
    let { user, setUser } = useStore();
    const { username, chatid } = searchParams;

    const [protocolForums, setProtocolForums] = useState(null); // TODO: change to null
    let [search, setSearch] = useState("");

    const fetchData = async () => {
        // social page is an entry point. It must be able to load user from params
        try {
            const userData = await fetchUserData(username, chatid);
            setUser(userData);

            const foraResponse = await axios.get(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v4/forum/`,
            );
            setProtocolForums(foraResponse.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Render a spinner until all data loaded
    // if (!protocolForums || user == BASE_USER) {
    //     return <Spinner />;
    // }
    if (!protocolForums) {
        return <Spinner />;
    }

    return (
        <PageLoader
            children={
                <div
                    className={clsx(
                        "flex flex-col w-full h-screen overflow-hidden",
                        MAX_WIDTH,
                    )}
                >
                    <div className="flex flex-col grow overflow-y-scroll hide-scrollbar">
                        <Title text="Social" />

                        {protocolForums.length > 0 && (
                            <SearchBar
                                searchTerm={search}
                                setSearch={setSearch}
                                placeholder={"Search for a protocol"}
                            />
                        )}
                        <ForumList protocolForums={protocolForums} />
                    </div>
                    <UserConnector />
                </div>
            }
        />
    );
}
