"use client";
import { fetchProtocolById } from "../db/protocol";
import { ProtocolIcon } from "@/components/page/ProtocolIcon";
import { useEffect, useState } from "react";
import { useStore } from "@/store";

const op = "optimism";

// OpIcon ignores classes input from parent
export const OpIcon = () => {
    const { getCachedProtocol } = useStore();
    const cachedOpInfo = getCachedProtocol(op);
    const [opInfo, setOpInfo] = useState(cachedOpInfo);

    const fetchData = async () => {
        if (!opInfo) {
            let opInfo = await fetchProtocolById(op);
            setOpInfo(opInfo);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return <ProtocolIcon protocol={opInfo} size={20} classes="h-5 w-6" />;
};
