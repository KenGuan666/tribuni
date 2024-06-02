import { PageLoader } from "@/components/loaders";
import { UserConnector } from "@/components/Connectors";
import { MAX_WIDTH } from "@/components/constants";
import clsx from "clsx";
import { Settings } from "@/components/user/Settings";

export default function Page() {
	return (
		<PageLoader
			children={
				<div
					className={clsx(
						"flex flex-col items-center w-full grow overflow-y-scroll hide-scrollbar pb-2 bg-isSystemLightSecondary",
						MAX_WIDTH
					)}
				>
					<Settings />
					<UserConnector />
				</div>
			}
		/>
	);
}
