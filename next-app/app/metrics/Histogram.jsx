import React from "react";
import { Bar } from "react-chartjs-2";

export const Histogram = ({ data }) => {
    const _data = {
        labels: data.map((dataPoint) => dataPoint[0].name),
        datasets: [
            {
                label: "Subscribers Count",
                data: data.map((dataPoint) => dataPoint[1].subscriberCount),
                backgroundColor: "rgba(0,199,190,1)",
                borderColor: "rgba(0,199,190,1)",
                borderWidth: 1,
            },
            {
                label: "Proposals Summarized",
                data: data.map((dataPoint) => dataPoint[1].proposalCount),
                backgroundColor: "rgba(0,122,255,1)",
                borderColor: "rgba(0,122,255,1)",
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                beginAtZero: true,
            },
            y: {
                beginAtZero: true,
            },
        },
        plugins: {
            legend: {
                display: true,
                position: "top",
            },
            tooltip: {
                mode: "index",
                intersect: false,
            },
        },
    };

    return (
        <div style={{ height: "500px", width: "100%", overflowX: "auto" }}>
            <div style={{ height: "500px", width: "1000px" }}>
                <Bar data={_data} options={options} />
            </div>
        </div>
    );
};
