import React from "react";

const BookmarkIcon = ({
    fillColor = "#000000",
    strokeWidth = 2,
    height = "20px",
    width = "20px",
}) => {
    return (
        <svg
            fill={fillColor}
            height={height}
            width={width}
            version="1.1"
            id="Capa_1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48.065 48.065"
        >
            <path
                d="M40.908,0H7.158c-0.553,0-1,0.448-1,1v46.065c0,0.401,0.239,0.763,0.608,0.92c0.369,0.157,0.797,0.078,1.085-0.2
        l16.182-15.582l16.182,15.582c0.189,0.183,0.439,0.28,0.693,0.28c0.132,0,0.266-0.026,0.392-0.08c0.369-0.157,0.608-0.52,0.608-0.92
        V1C41.908,0.448,41.46,0,40.908,0z M39.908,44.714L24.726,30.095c-0.193-0.187-0.443-0.28-0.693-0.28s-0.5,0.093-0.693,0.28
        L8.158,44.714V2h31.75V44.714z"
                strokeWidth={strokeWidth}
                stroke={fillColor}
            />
        </svg>
    );
};

export default BookmarkIcon;
