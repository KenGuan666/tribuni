import { ProtocolIcon } from "@/components/page/ProtocolIcon";
import IosShareIcon from "@mui/icons-material/IosShare";
import Link from "next/link";

export const ExternalLinkButton = ({
    url,
    text,
    protocol,
    primary_color,
    background_color,
}) => {
    return (
        <Link
            href={url}
            target="_blank"
            style={{
                padding: "4px 16px",
                borderRadius: "33px",
                display: "flex",
                justifyContent: "space-evenly",
                flexDirection: "row",
                alignItems: "center",
                fontSize: "13px",
                color: primary_color,
                backgroundColor: background_color,
            }}
        >
            {protocol?.icon && (
                <ProtocolIcon protocol={protocol} fill={false} size={16} />
            )}{" "}
            <p
                style={{
                    marginLeft: "5px",
                    marginRight: "5px",
                    whiteSpace: "nowrap",
                }}
            >
                {text}
            </p>
            <IosShareIcon
                style={{
                    height: "16px",
                    width: "16px",
                }}
            />
        </Link>
    );
};
