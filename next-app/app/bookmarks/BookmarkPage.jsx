"use client";

import React from "react";
import clsx from "clsx";
import { useState } from "react";
import { ANIMATE, MAX_WIDTH } from "@/components/constants";
import { Title } from "@/components/ui/page";
import { SearchBar } from "@/components/page";
import { useStore } from "@/store";

export const BookmarkPage = ({ proposals }) => {
    let [search, setSearch] = useState("");
    return (
        <React.Fragment>
            <Title text="Bookmarks" />
            <SearchBar
                searchTerm={search}
                setSearch={setSearch}
                placeholder={"search by protocol, proposal title"}
            />
        </React.Fragment>
    );
};
