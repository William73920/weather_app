import React from "react";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";

const LineChart = ({ hourlyData }) => {
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");

    return `${hours}:${minutes}`;
  };

  return (
    <Line
      data={{
        labels: hourlyData?.list?.map((item) => formatTimestamp(item.dt)),
        datasets: [
          {
            label: "Temperature",
            data: hourlyData?.list?.map((item) => item.main.temp.toFixed(0)),
          },
        ],
      }}
    />
  );
};

export default LineChart;
