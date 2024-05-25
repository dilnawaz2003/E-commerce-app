import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

export const LineChart = ({ labels, labelsData, heading, color }) => {
  const chartData = {
    labels: labels,
    datasets: [
      {
        data: labelsData,
        fill: true,
        borderWidth: 2,
        backgroundColor: [color],
        borderColor: [color],
      },
    ],
  };
  return (
    <Line
      data={chartData}
      options={{
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          title: { display: true, text: heading },
          legend: { display: false },
        },
      }}
    ></Line>
  );
};
