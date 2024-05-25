import Table from "../../Components/table";
import { Link, useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { useAllProductsQuery } from "../../redux/api/product-api";
import { useEffect, useState } from "react";

const Manage = ({ to }) => {
  return (
    <Link className="bg-blue-300 text-white p-1 rounded-md" to={to}>
      manage
    </Link>
  );
};

const cols = [
  {
    Header: "Id",
    accessor: "id",
    Cell: (props) => {
      const id = props.row.original._id;
      const length = id.length;
      return (
        <p>
          {id.substring(1, 4)}....{id.substring(length - 3, length)}
        </p>
      );
    },
  },
  {
    Header: "Photo",
    accessor: "photo",
    Cell: (props) => {
      return (
        <img
          src={`http://localhost:5000/${props.row.original.photo}`}
          className="size-14 my-1 object-contain"
        ></img>
      );
    },
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Price",
    accessor: "price",
  },
  {
    Header: "Stock",
    accessor: "stock",
  },
  {
    Header: "Action",
    accessor: "action",
    Cell: (props) => {
      return <Manage to={`/admin/product/${props.row.original._id}`} />;
    },
  },
];

const Product = () => {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState();

  const { data, isLoading, isError, error } = useAllProductsQuery();

  const startIndex = (page - 1) * 8;
  const endIndex = startIndex + 8;

  const products = data?.products;
  const productsSinglePage = products?.slice(startIndex, endIndex);
  const navigate = useNavigate();

  useEffect(() => {
    if (data) {
      setTotalPages(Math.ceil(data.products.length / 8));
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

  return (
    <div className="w-full min-h-[calc(100vh-100px)]  relative ">
      <div className="flex justify-between m-2 ">
        <p className="font-bold text-2xl">Products</p>
        <button
          onClick={() => navigate("/admin/product/new")}
          className="rounded-full size-10 bg-slate-700 text-white  flex justify-center items-center"
        >
          <FaPlus />
        </button>
      </div>
      <div className="m-2 rounded-md shadow-lg p-2 ">
        {isLoading ? (
          <h1>Loading...</h1>
        ) : isError ? (
          <h1 className="text-center">
            Some Thing Went Wrong . Please Try Again
          </h1>
        ) : (
          <Table columns={cols} data={productsSinglePage}></Table>
        )}
      </div>
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

export default Product;
