import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, Title } from "chart.js/auto";

// REVENUE AND TRANSACTION
const BarChart = ({ title1, title2, labels, data1, data2, heading }) => {
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: title1,
        data: data1,
        borderWidth: 1,
      },
      {
        label: title2,
        data: data2,
        borderWidth: 1,
      },
    ],
  };
  return (
    <Bar
      data={chartData}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: heading,
          },
        },
      }}
    ></Bar>
  );
};

export default BarChart;
