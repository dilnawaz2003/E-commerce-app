import { Chart as ChartJS } from "chart.js/auto";
import { Doughnut } from "react-chartjs-2";

const DoughnutChart = ({
  labels,
  labelsData,
  legendShow,
  showTitle,
  heading,
}) => {
  const chartData = {
    labels: labels,
    datasets: [
      {
        data: labelsData,
        borderWidth: 3,
      },
    ],
  };
  return (
    <Doughnut
      data={chartData}
      options={{
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          title: { display: showTitle, text: heading },
          legend: { display: legendShow },
        },
      }}
    ></Doughnut>
  );
};

export default DoughnutChart;
