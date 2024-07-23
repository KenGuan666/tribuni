import React from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import "chartjs-adapter-date-fns";

Chart.register(...registerables);

export const CountByTimeChart = ({ timestamps }) => {
    console.log(timestamps);
    const aggregatedData = aggregateByDate(timestamps);

    const data = {
        labels: aggregatedData.map((dataPoint) => dataPoint.date),
        datasets: [
            {
                label: "Tribuni User Count Over Time",
                data: aggregatedData.map((dataPoint) => dataPoint.count),
                fill: false,
                backgroundColor: "rgba(75,192,192,1)",
                borderColor: "rgba(75,192,192,1)",
                pointBackgroundColor: "rgba(75,192,192,1)",
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgba(75,192,192,1)",
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                type: "time",
                time: {
                    unit: "day",
                    displayFormats: {
                        day: "MMM d",
                    },
                },
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
                <Line data={data} options={options} />
            </div>
        </div>
    );
};

function aggregateByDate(timestamps) {
    const counts = {};

    timestamps.forEach((ts) => {
        const date = new Date(ts * 1000).toISOString().split("T")[0];
        if (counts[date]) {
            counts[date]++;
        } else {
            counts[date] = 1;
        }
    });

    const sortedDates = Object.keys(counts).sort();
    const cumulativeCounts = sortedDates.map((date, index) => ({
        date,
        count: sortedDates
            .slice(0, index + 1)
            .reduce((sum, key) => sum + counts[key], 0),
    }));

    return cumulativeCounts;
}

export default CountByTimeChart;
