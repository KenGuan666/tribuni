import { Navigator } from "@/components/page/Navigator";
import { ExternalLinkButton } from "./ExternalLinkButton";

export const ForumNavigator = ({ backUrl, forum, backText, buttonText }) => {
    return (
        <div className="flex flex-row justify-between items-center items-start w-full group">
            <Navigator
                text={backText}
                link={backUrl}
                primary_color={forum.primary_color}
            />
            <ExternalLinkButton
                url={forum.forum_url}
                text={buttonText}
                protocol={{
                    id: forum.protocol_id,
                    icon: forum.icon,
                }}
                primary_color={forum.primary_color}
                background_color={forum.background_color}
            />
        </div>
    );
};
