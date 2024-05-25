import { useSelector } from "react-redux";
import Table from "../Components/table";
import { useMyOrdersQuery } from "../redux/api/order-api";

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
    Header: "Status",
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
  {
    Header: "Action",
    accessor: "action",
    // Cell: (props) => {
    //   return (
    //     <Link
    //       className="bg-blue-300 text-white p-1 rounded-md "
    //       to={`/admin/transaction/${props.row.original.user}`}
    //     >
    //       View{" "}
    //     </Link>
    //   );
    // },
  },
];

const Order = () => {
  const { _id } = useSelector((state) => state.userSlice.user);
  const { data, isLoading, isError, error } = useMyOrdersQuery(_id);

  let content = "";

  if (isLoading) content = <h1>Loading...</h1>;
  if (isError) content = <h1>Some Thing Went Wrong</h1>;
  if (data) {
    const orders = data.orders;

    content = (
      <Table
        columns={cols}
        data={orders.map((i) => {
          return {
            id: i._id,
            amount: i.total,
            discount: i.discount,
            quantity: i.orderItems.length,
            status: i.status,
            action: "view",
          };
        })}
      ></Table>
    );
  }

  return (
    <div className="mt-20 p-6">
      <h1 className="uppercase text-3xl text-gray-500">My Orders</h1>
      <div className="m-4 text-center">
        <p className="uppercase text-xl text-gray-500 mb-4">Orders</p>
        {content}
      </div>
    </div>
  );
};

export default Order;
