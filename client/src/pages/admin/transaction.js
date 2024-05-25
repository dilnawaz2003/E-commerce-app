import Table from "../../Components/table";
import { Link } from "react-router-dom";
import { useAllOrdersQuery } from "../../redux/api/order-api";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

const Manage = ({ to }) => {
  return (
    <Link className="bg-blue-300 text-white p-1 rounded-md " to={to}>
      manage
    </Link>
  );
};

const cols = [
  {
    Header: "User",
    accessor: "user",
  },
  {
    Header: "Amount",
    accessor: "amount",
  },
  {
    Header: "Discount",
    accessor: "discount",
  },
  {
    Header: "Quantity",
    accessor: "quantity",
  },
  {
    Header: "Status",
    accessor: "status",
    Cell: (props) => {
      //   console.log(props.row.original.status);
      const status = props.row.original.status;
      const color =
        status === "Processing"
          ? "red"
          : status === "Shipped"
          ? "green"
          : "green";
      return <p className={`text-${color}-500`}>{status}</p>;
    },
  },
  {
    Header: "Action",
    accessor: "action",
    Cell: (props) => {
      return <Manage to={`/admin/transaction/${props.row.original.orderId}`} />;
    },
  },
];

const Transaction = () => {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState();

  const startIndex = (page - 1) * 8;
  const endIndex = startIndex + 8;

  const { _id } = useSelector((state) => state.userSlice.user);
  const { data, isLoading, isError } = useAllOrdersQuery(_id);

  let content = "";

  useEffect(() => {
    if (data) {
      setTotalPages(Math.ceil(data?.orders.length / 8));
    }
  }, [data]);

  const moveBackHandler = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };
  const moveForwardHandler = () => {
    if (page < totalPages) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  if (isLoading) content = <h1>Loading...</h1>;
  if (isError) content = <h1>Some Thing Went Wrong</h1>;
  if (data) {
    const orders = data.orders;

    const ordersSinglePage = orders.slice(startIndex, endIndex);
    content = (
      <Table
        columns={cols}
        data={ordersSinglePage.map((i) => {
          return {
            orderId: i._id,
            user: i.user.name,
            amount: i.total,
            discount: i.discount,
            quantity: i.orderItems.length,
            status: i.status,
          };
        })}
      ></Table>
    );
  }

  return (
    <div className="w-full relative">
      <div className="flex justify-between m-2">
        <p className="font-bold text-2xl ">Transactions</p>
      </div>
      <div className="m-2 rounded-md shadow-lg p-2 ">{content}</div>
      <div className=" p-2 flex justify-center items-center gap-4 bg w-full absolute bottom-[-50px]">
        <button
          onClick={moveBackHandler}
          className="rounded-md px-2 py-1 text-white bg-[#006786] "
        >
          Previous
        </button>
        <p>
          {page} of {totalPages}
        </p>
        <button
          onClick={moveForwardHandler}
          className="rounded-md px-2 py-1 text-white bg-[#006786] "
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Transaction;
