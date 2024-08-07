/*
    options: [{
        text: "Text",
        state: "text",
    }]
*/
export const Tabs = ({
    activeDisplay,
    setActiveDisplay,
    options,
    primary_color,
}) => {
    return (
        <div
            style={{
                padding: "20px 0px 2px 0px",
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                width: "100%",
            }}
        >
            {options.map((option) => (
                <button
                    onClick={() => setActiveDisplay(option.state)}
                    style={{
                        padding: "0px 8px 0px 0px",
                        color:
                            activeDisplay === option.state
                                ? "#000"
                                : "rgba(0, 0, 0, 0.5)",
                        fontSize: "15px",
                        fontWeight:
                            activeDisplay === option.state ? "600" : "400",
                        marginRight: "10px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                        transition: "all 0.3s ease",
                    }}
                >
                    {option.text}
                    <div
                        style={{
                            height: "3px",
                            width:
                                activeDisplay === option.state ? "15px" : "0px",
                            backgroundColor: primary_color,
                            marginTop: "2px",
                            transition: "all 0.3s ease",
                        }}
                    />
                </button>
            ))}
        </div>
    );
};
