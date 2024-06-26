import { Pie } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

export const PieChart = ({ labels, labelsData }) => {
  const data = {
    labels: labels,
    datasets: [
      {
        data: labelsData,
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return <Pie data={data} />;
};
