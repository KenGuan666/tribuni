import clsx from "clsx";
import { ANIMATE, MAX_WIDTH, delay } from "@/components/constants";
import { MagnifyingGlass } from "@/components/ios";
import { Cancel } from "@/components/material-rounded/Cancel";

export const SearchBar = ({ searchTerm, setSearch, placeholder }) => {
    placeholder = placeholder ? placeholder : "Search";
    return (
        <div
            className={clsx(
                "flex flex-row items-center w-full px-4 shrink-0 pt-3",
                ANIMATE,
                MAX_WIDTH,
            )}
        >
            <div className="flex flex-row items-center w-full py-1 px-2 space-x-1 rounded-xl place-content-center bg-isFillLightTertiary">
                <MagnifyingGlass
                    classes={clsx(
                        "w-7 h-7 fill-isLabelLightSecondary shrink-0",
                    )}
                />

                <input
                    id="search"
                    placeholder={placeholder}
                    onChange={(e) => {
                        setSearch(e.target.value);
                    }}
                    value={searchTerm}
                    type="text"
                    className={clsx(
                        "grow bg-transparent outline-none text-lg focus:outline-none font-400 placeholder:text-isLabelLightSecondary text-isLabelLightPrimary leading-none",
                        ANIMATE,
                    )}
                />

                {searchTerm !== "" && (
                    <button
                        onClick={async () => {
                            setSearch("");
                            const div = document.getElementById("search");

                            await delay(20);

                            if (div) {
                                div.focus();
                            }
                        }}
                    >
                        <Cancel
                            classes={clsx(
                                "w-[1.2rem] h-[1.2rem] fill-isLabelLightSecondary shrink-0",
                            )}
                        />
                    </button>
                )}
            </div>
        </div>
    );
};
