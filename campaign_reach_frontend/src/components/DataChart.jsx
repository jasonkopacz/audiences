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
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DataChart = ({ efficiencyData, reachData }) => {
  // Transform data for chart
  const reachLevels = efficiencyData.map((item) => item.CUMULATIVE_REACH);
  const efficiencies = efficiencyData.map((item) => item.ZIP_TARGET_DENSITY);
  const totalPeople = efficiencyData.map((item) => item.ZIP_TOTAL_PEOPLE);
  const zipcodes = efficiencyData.map((item) => item.ZIPCODE);

  const chartData = {
    labels: reachLevels,
    datasets: [
      {
        label: "Target Density",
        data: efficiencies,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        yAxisID: "y1"
      },
      {
        label: "Total People",
        data: totalPeople,
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
        text: "Target Density and Total People vs. Cumulative Reach"
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
      y1: {
        type: "linear",
        display: true,
        position: "left",
        title: {
          display: true,
          text: "Target Density"
        },
        beginAtZero: true
      },
      y2: {
        type: "linear",
        display: true,
        position: "right",
        title: {
          display: true,
          text: "Total People"
        },
        beginAtZero: true,
        grid: {
          drawOnChartArea: false // only want the grid lines for one axis to show up
        }
      }
    }
  };

  return <Line data={chartData} options={options} />;
};

export default DataChart;
