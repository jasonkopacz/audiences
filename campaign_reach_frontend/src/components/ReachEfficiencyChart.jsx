import useSWR from "swr";
import { Line } from "react-chartjs-2";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

function ReachEfficiencyChart() {
  const { data, error } = useSWR("/api/reach-efficiency/", fetcher);

  if (error) return <div>Failed to load data</div>;
  if (!data) return <div>Loading...</div>;

  const labels = Array.from({ length: 11 }, (_, i) => (i * 0.1).toFixed(1));
  const datasets = [
    {
      label: "Reach Efficiency",
      data: labels.map((label) => data[label] || null),
      fill: false,
      borderColor: "rgba(75,192,192,1)"
    }
  ];

  const chartData = {
    labels,
    datasets
  };

  return (
    <div>
      <Line
        data={chartData}
        options={{
          scales: {
            xAxes: [
              {
                title: {
                  display: true,
                  text: "Reach Level"
                }
              }
            ],
            yAxes: [
              {
                title: {
                  display: true,
                  text: "Target Density"
                },
                ticks: {
                  min: 0,
                  max: 1,
                  stepSize: 0.1
                }
              }
            ]
          }
        }}
      />
    </div>
  );
}

export default ReachEfficiencyChart;
