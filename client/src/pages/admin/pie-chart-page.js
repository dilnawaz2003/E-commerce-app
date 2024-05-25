// will be filled with charts when data is avalible -> backend is prepared
import { useSelector } from "react-redux";

import { usePieChartsDataQuery } from "../../redux/api/stats-api";
import { PieChart } from "../../Components/admin/Charts/pie-chart";
import DoughnutChart from "../../Components/admin/Charts/doughnut-chart";

const PieChartPage = () => {
  const { _id } = useSelector((state) => state.userSlice.user);
  const { isLoading, isError, data, error } = usePieChartsDataQuery(_id);

  if (isLoading) return <h1>Loading</h1>;
  if (isError) return <h1>Some Thing went wrong</h1>;

  const stats = data.stats;

  const orderFullfilementRatioData = [
    stats.orderFullfilementRatio.deliverdOrdersCount,
    stats.orderFullfilementRatio.processingOrdersCount,
    stats.orderFullfilementRatio.shippedOrdersCount,
  ];
  return (
    <div className="flex flex-col items-center justify-center mt-3 w-full">
      <h1 className="font-medium text-xl">PIE AND DOUGHNUT CHARTS</h1>

      <div className="h-[300px] w-[calc(100vw-40%)] my-5 grid place-content-center">
        <PieChart
          labels={["Deliverd", "Proccessing", "Shipped"]}
          labelsData={orderFullfilementRatioData}
        ></PieChart>
      </div>
      <div className="h-[300px] w-[calc(100vw-40%)] my-5 grid place-content-center">
        <DoughnutChart
          labels={stats.categoriesRatio.map((c) => Object.keys(c)[0])}
          labelsData={stats.categoriesRatio.map((c) => Object.values(c)[0])}
          legendShow={false}
          showTitle={true}
          heading={"PRODUCT CATEGORY RATIO"}
        ></DoughnutChart>
      </div>
      <div className="h-[300px] w-[calc(100vw-40%)] my-5 grid place-content-center">
        <DoughnutChart
          labels={["IN STOCK ", "OUT OF STOCK"]}
          labelsData={[
            stats.stockAvailability.inStockProducts,
            stats.stockAvailability.outOfStockProducts,
          ]}
          legendShow={true}
          showTitle={true}
          heading={"STOCK AVAILABILITY"}
        ></DoughnutChart>
      </div>
      <div className="h-[300px] w-[calc(100vw-40%)] my-5 grid place-content-center">
        <DoughnutChart
          labels={Object.keys(stats.usersAgeGroup)}
          labelsData={Object.values(stats.usersAgeGroup)}
          legendShow={true}
          showTitle={true}
          heading={"USERS AGE GROUP"}
        ></DoughnutChart>
      </div>
      <div className="h-[300px] w-[calc(100vw-40%)] my-5 grid place-content-center">
        <DoughnutChart
          labels={Object.keys(stats.userTypeCount)}
          labelsData={Object.values(stats.userTypeCount)}
          legendShow={true}
          showTitle={true}
          heading={"ADMIN CUSTOMER USERS RATIO"}
        ></DoughnutChart>
      </div>
    </div>
  );
};

export default PieChartPage;
