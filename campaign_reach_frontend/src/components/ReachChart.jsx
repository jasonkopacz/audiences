import React from "react";
import { useEffect, useRef } from "react";
import useSWR from "swr";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement
);

function ReachChart({ reachData }) {
  // Extracting reach data for the chart
  const reachLevels = reachData.map((item) => item.total_reach);
  const efficiencies = reachData.map((item) => item.pct_reach * 100);
  const targetDensities = reachData.map((item) => item.target_density * 100);
  const zipcodes = reachData.map((item) => item.zipcode_number);

  const chartData = {
    labels: reachLevels,
    datasets: [
      {
        label: "Efficiency (pct_reach)",
        data: efficiencies,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        yAxisID: "y1"
      },
      {
        label: "Target Density",
        data: targetDensities,
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: true,
        yAxisID: "y2"
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top"
      },
      title: {
        display: true,
        text: "Efficiency and Target Density vs. Reach Levels"
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const index = context.dataIndex;
            const label = context.dataset.label || "";
            const value = context.raw;
            const zipcode = zipcodes[index];
            return `${label}: ${value}\nZipcode: ${zipcode}`;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Total Reach"
        }
      },
      y1: {
        type: "linear",
        display: true,
        position: "left",
        title: {
          display: true,
          text: "Efficiency (pct_reach)"
        },
        beginAtZero: true
      },
      y2: {
        type: "linear",
        display: true,
        position: "right",
        title: {
          display: true,
          text: "Target Density"
        },
        beginAtZero: true,
        grid: {
          drawOnChartArea: false // only want the grid lines for one axis to show up
        }
      }
    }
  };

  return (
    <div>
      <h2>Reach Efficiency Chart</h2>
      <Line data={chartData} options={options} />
    </div>
  );
}

export default ReachChart;
