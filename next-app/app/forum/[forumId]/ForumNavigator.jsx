import { ProtocolIcon } from "@/components/page/ProtocolIcon";
import { Navigator } from "@/components/page/Navigator";
import IosShareIcon from "@mui/icons-material/IosShare";
import Link from "next/link";

export const ForumNavigator = ({ backUrl, forum }) => {
    return (
        <div className="flex flex-row justify-between items-center items-start w-full group">
            <Navigator
                text="Protocols"
                link={backUrl}
                primary_color={forum.primary_color}
            />
            <Link
                href={`${forum.forum_url}`}
                target="_blank"
                style={{
                    padding: "4px 16px",
                    borderRadius: "33px",
                    display: "flex",
                    justifyContent: "space-evenly",
                    flexDirection: "row",
                    alignItems: "center",
                    fontSize: "13px",
                    color: forum.primary_color,
                    backgroundColor: forum.background_color,
                }}
            >
                {forum && (
                    <ProtocolIcon protocol={forum} fill={false} size={16} />
                )}{" "}
                <p
                    style={{
                        marginLeft: "5px",
                        marginRight: "5px",
                        whiteSpace: "nowrap",
                    }}
                >
                    Go to Forum
                </p>
                <IosShareIcon
                    style={{
                        height: "16px",
                        width: "16px",
                    }}
                />
            </Link>
        </div>
    );
};
