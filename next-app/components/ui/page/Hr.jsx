import { MAX_WIDTH } from "@/components/constants";
import clsx from "clsx";

export const Hr = ({ classes, useDarkColor }) => {
    const color = useDarkColor ? "bg-isSeparatorDark" : "bg-isSeparatorLight";
    return (
        <div className={clsx("w-full", MAX_WIDTH, classes)}>
            <hr className={clsx(`w-full rounded-full ${color} h-0`)} />
        </div>
    );
};
