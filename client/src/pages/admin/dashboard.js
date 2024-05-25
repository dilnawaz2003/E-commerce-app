import { useSelector } from "react-redux";
import BarChart from "../../Components/admin/Charts/bar-chart";
import DoughnutChart from "../../Components/admin/Charts/doughnut-chart";
import WidgetCard from "../../Components/admin/widget-card";
import Table from "../../Components/table";
import { useDashboardStatsQuery } from "../../redux/api/stats-api";

const cols = [
  {
    Header: "Id",
    accessor: "id",
  },
  {
    Header: "quantity",
    accessor: "quantity",
  },
  {
    Header: "discount",
    accessor: "discount",
  },
  {
    Header: "amount",
    accessor: "amount",
  },
  {
    Header: "status",
    accessor: "status",
    Cell: (props) => {
      const status = props.row.original.status;
      const color =
        status === "Processing"
          ? "red"
          : status === "Shipped"
          ? "blue"
          : "green";
      return <p className={`text-${color}-500`}>{status}</p>;
    },
  },
];

const Dashboard = () => {
  const { _id } = useSelector((stats) => stats.userSlice.user);
  const { data, isLoading, isError, error } = useDashboardStatsQuery(_id);

  if (isLoading) return <h1 className="text-center">Loading...</h1>;
  if (isError) return <h1 className="text-center">Some Thing Went WRong</h1>;

  const stats = data.stats;
  const categoriesRatio = stats.categoriesRatio;
  const chart = stats.orderAndTransactionChart;

  return (
    <div className="w-full pt-5">
      <div className="flex justify-evenly flex-wrap">
        <WidgetCard
          title={"Revenue"}
          count={stats.count.totalRevenue}
          percent={stats.percent.revenueChangePercent}
        />
        <WidgetCard
          title={"Users"}
          count={stats.count.usersCount}
          percent={stats.percent.userChangePercent}
        />
        <WidgetCard
          title={"Transactions"}
          count={stats.count.ordersCount}
          percent={stats.percent.orderChangePercent}
        />
        <WidgetCard
          title={"Products"}
          count={stats.count.productsCount}
          percent={stats.percent.productChangePercent}
        />
      </div>
      <div className="flex m-4  gap-4">
        {/*Chart*/}
        <div className="h-[350px] flex-grow  rounded-md shadow-lg p-4    ">
          <BarChart
            heading={"REVENUE AND TRANSACTION"}
            title1={"Revenue"}
            title2={"Transation"}
            labels={Object.keys(chart.monthlyOrders)}
            data1={Object.values(chart.monthlyRevenue)}
            data2={Object.values(chart.monthlyOrders)}
          />
        </div>
        {/*Inventory*/}
        <div className="rounded-md shadow-lg p-2   h-[350px] overflow-y-auto ">
          <p className="text-gray-500 uppercase text-center">Inventory</p>
          <div className=" box-border p-2 ">
            {categoriesRatio.map((c) => {
              const [title, percent] = Object.entries(c)[0];
              return (
                <InventoryItem key={title} title={title} percent={percent} />
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex mx-4 my-10 gap-4">
        <div className="rounded-md shadow-lg p-4 w-1/4  ">
          <DoughnutChart
            labels={["Male", "Female"]}
            labelsData={[stats.usersRatio.male, stats.usersRatio.female]}
            showTitle={false}
            heading={"Gender Ratio"}
          ></DoughnutChart>
        </div>
        <div className="rounded-md shadow-lg p-4 w-3/4">
          <Table
            columns={cols}
            data={stats.latestTransactions.map((t) => {
              return {
                id: t._id,
                quantity: t.quantity,
                amount: t.amount,
                status: t.status,
                discount: t.discount,
              };
            })}
          ></Table>
        </div>
      </div>
    </div>
  );
};

const InventoryItem = ({ title, percent }) => {
  return (
    <div className="flex gap-2 items-center justify-start mb-2 mr-2 ">
      <span className="text-gray-500">{title}</span>
      <div className="flex  items-center justify-end  w-[100%] gap-1">
        <div className="h-[10px] rounded-lg bg-gray-300 w-20 ">
          <div
            className={`h-full overflow-hidden  rounded-lg z-10`}
            style={{
              background: `rgb(${(percent * 50) % 200}, ${
                (percent * 128) % 180
              },${(percent * 160) % 230})`,
              width: `${percent}%`,
            }}
          ></div>
        </div>
        <span className="items-end"> {percent}%</span>
      </div>
    </div>
  );
};

export default Dashboard;
