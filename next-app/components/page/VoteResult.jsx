import React from "react";

// color bars for vote options
const colors = [
    "rgb(0, 199, 190)",
    "rgb(50, 173, 230)",
    "rgb(0, 122, 255)",
    "rgb(88, 86, 214)",
    "rgb(175, 82, 222)",
    "rgb(255, 45, 85)",
    "rgb(162, 132, 94)",
];

/*
VoteResult: visualize the vote count of each choice as of last proposal update

choices: an array of strings, each representing a vote choice
        eg. ["Yes", "No", "Abstain"]
results: an array of objects representing vote count on each choice. 
        If a choice is absent, its count is 0. Choices are 0-indexed
        eg. [{ "choice": 0, "total": 10 }, { "choice": 2, "total": 1 }] means 10 votes on "Yes", 0 votes "No" and 1 "Abstain"
*/
export const VoteResult = ({ choices, results }) => {
    if (!results || !results.length) {
        return null;
    }

    const totalVotes = results.reduce(
        (acc, result) => acc + parseFloat(result?.total ?? 0),
        0,
    );

    return (
        <div className="w-full h-fit mt-5">
            <div className="flex flex-col items-center w-full bg-isWhite p-4 rounded-xl">
                <div className="w-full">
                    <div className="flex flex-col items-center w-full text-xs capitalize rounded-lg bg-isWhite text-isLabelLightSecondary font-400">
                        {choices.map((choice, idx) => {
                            // For each choice, calculate the percentage of votes it received
                            let votesReceived,
                                percent = 0;
                            // elements in results could be null
                            let matchedRes = results.filter(
                                (res) => res && res.choice == idx.toString(),
                            );
                            if (matchedRes.length) {
                                votesReceived = matchedRes[0].total;
                                percent = (
                                    (parseFloat(votesReceived) / totalVotes) *
                                    100
                                ).toFixed(2);
                            }

                            // format votesReceived number for best visual
                            const votesReceivedFormatted =
                                new Intl.NumberFormat("en", {
                                    notation: "compact",
                                    compactDisplay: "short",
                                    maximumFractionDigits: 1,
                                }).format(votesReceived);
                            const color = colors[idx % colors.length];

                            return (
                                <React.Fragment key={idx}>
                                    {idx !== 0 && <div className="mb-3" />}

                                    <div className="w-full space-x-2">
                                        <div className="relative h-3 bg-isSystemLightSecondary rounded-2xl overflow-hidden">
                                            <div
                                                className="absolute top-0 h-3 rounded-2xl"
                                                style={{
                                                    width: `${percent}%`,
                                                    backgroundColor: color,
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-row items-center justify-between w-full mt-1">
                                        <div className="flex flex-row items-center">
                                            <div className="truncate text-ellipsis max-w-[7rem]">
                                                {choice}
                                            </div>{" "}
                                            <div>, {percent}%</div>
                                        </div>
                                        <div className="ml-auto">
                                            {votesReceivedFormatted} votes
                                        </div>
                                    </div>
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};
