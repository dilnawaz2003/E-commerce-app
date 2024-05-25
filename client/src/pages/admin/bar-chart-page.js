import { useSelector } from "react-redux";
import BarChart from "../../Components/admin/Charts/bar-chart";
import { useBarChartsDataQuery } from "../../redux/api/stats-api";

const BarChartPage = () => {
  const { _id } = useSelector((state) => state.userSlice.user);
  const { isLoading, isError, data, error } = useBarChartsDataQuery(_id);

  if (isLoading) return <h1>Loading</h1>;
  if (isError) return <h1>Some Thing went wrong</h1>;

  const stats = data.stats;

  return (
    <div className="flex flex-col items-center mt-3">
      <h1 className="font-medium text-xl">BarCharts</h1>

      <div className="h-[300px] w-[calc(100vw-40%)] my-5 ">
        <BarChart
          heading={"TOP PRODUCTS AND TOP CUSTOMERS "}
          title1={"PRODUCTS"}
          title2={"CUSTOMERS"}
          data1={Object.values(stats.counts.product)}
          data2={Object.values(stats.counts.user)}
          labels={Object.keys(stats.counts.product)}
        />
      </div>
      <div className="h-[300px] w-[calc(100vw-40%)] my-5 ">
        <BarChart
          heading={"ORDERS THROUGHOUT THE YEAR"}
          title1={"ORDERS"}
          data1={Object.values(stats.counts.order)}
          labels={Object.keys(stats.counts.order)}
        />
      </div>
    </div>
  );
};

export default BarChartPage;
