import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DataChart = ({ efficiencyData }) => {
  // Transform data for chart
  const zipcodes = efficiencyData.map((item) => item.ZIPCODE);
  const cumulativeAudReach = efficiencyData.map(
    (item) => item.CUMULATIVE_AUD_REACH * 100
  );
  const cumulativeTotalReach = efficiencyData.map(
    (item) => item.CUMULATIVE_TOTAL_REACH
  );
  const cumulativePctReach = efficiencyData.map(
    (item) => item.CUMULATIVE_PCT_REACH * 100
  );
  const cumulativeTargetDensity = efficiencyData.map(
    (item) => item.CUMULATIVE_TARGET_DENSITY * 100
  );

  const chartData = {
    labels: zipcodes,
    datasets: [
      {
        type: "line",
        label: "Cumulative Audience Reach",
        data: cumulativeAudReach,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        yAxisID: "y1"
      },
      {
        type: "line",
        label: "Cumulative Total Reach",
        data: cumulativeTotalReach,
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: true,
        yAxisID: "y1"
      },
      {
        type: "line",
        label: "Cumulative % Reach",
        data: cumulativePctReach,
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        fill: true,
        yAxisID: "y1"
      },
      {
        type: "line",
        label: "Cumulative Target Density",
        data: cumulativeTargetDensity,
        borderColor: "rgba(153, 102, 255, 1)",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
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
        text: "Cumulative Metrics vs. Zipcodes"
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
          text: "Zipcodes"
        }
      },
      y1: {
        type: "linear",
        display: true,
        position: "left",
        title: {
          display: true,
          text: "Reach Metrics"
        },
        beginAtZero: true
      },
      y2: {
        type: "linear",
        display: true,
        position: "right",
        title: {
          display: true,
          text: "Cumulative Target Density"
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
