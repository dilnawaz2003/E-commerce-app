// will be filled with charts when data is avalible -> backend is prepared

import { LineChart } from "../../Components/admin/Charts/line-chart";
import { useLineChartsDataQuery } from "../../redux/api/stats-api";
import { useSelector } from "react-redux";

const LineChartPage = () => {
  const { _id } = useSelector((state) => state.userSlice.user);
  const { isLoading, isError, data, error } = useLineChartsDataQuery(_id);

  if (isLoading) return <h1>Loading</h1>;
  if (isError) return <h1>Some Thing went wrong</h1>;

  const stats = data.stats;
  return (
    <div className="flex flex-col items-center justify-center mt-3 w-full">
      <h1 className="font-medium text-xl">LINE CHARTS</h1>

      <div className="h-[300px] w-[calc(100vw-40%)] my-5 grid place-content-center">
        <LineChart
          labels={Object.keys(stats.counts.user)}
          labelsData={Object.values(stats.counts.user)}
          heading={"ACTIVE USERS"}
          color={"rgba(153, 102, 255, 0.6)"}
        ></LineChart>
      </div>
      <div className="h-[300px] w-[calc(100vw-40%)] my-5 grid place-content-center">
        <LineChart
          labels={Object.keys(stats.counts.product)}
          labelsData={Object.values(stats.counts.product)}
          heading={"TOTAL PRODUCTS"}
          color={"rgba(255, 99, 132, 0.6)"}
        ></LineChart>
      </div>
      <div className="h-[300px] w-[calc(100vw-40%)] my-5 grid place-content-center">
        <LineChart
          labels={Object.keys(stats.counts.revenue)}
          labelsData={Object.values(stats.counts.revenue)}
          heading={"TOTAL REVENUE"}
          color={"rgba(54, 162, 235, 0.6)"}
        ></LineChart>
      </div>
      <div className="h-[300px] w-[calc(100vw-40%)] my-5 grid place-content-center">
        <LineChart
          labels={Object.keys(stats.counts.discount)}
          labelsData={Object.values(stats.counts.discount)}
          heading={"TOTAL DISCOUNT ALLOTED"}
          color={"rgba(255, 206, 86, 0.6)"}
        ></LineChart>
      </div>
    </div>
  );
};

export default LineChartPage;
