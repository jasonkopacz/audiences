import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const EfficiencyChart = ({ efficiencyData }) => {
  // Transform efficiencyData for chart
  const zipcodes = efficiencyData.map((item) => item.ZIPCODE);
  const targetDensities = efficiencyData.map((item) => item.ZIP_TARGET_DENSITY);
  const cumulativeReaches = efficiencyData.map((item) => item.CUMULATIVE_REACH);

  const chartData = {
    labels: cumulativeReaches,
    datasets: [
      {
        label: "Target Density",
        data: targetDensities,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true
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
        text: "Target Density vs. Cumulative Reach"
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
          text: "Cumulative Reach"
        }
      },
      y: {
        title: {
          display: true,
          text: "Target Density"
        },
        beginAtZero: true
      }
    }
  };

  return <Line data={chartData} options={options} />;
};

export default EfficiencyChart;
