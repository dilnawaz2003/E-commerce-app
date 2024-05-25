import Table from "../../Components/table";
import { FaTrash } from "react-icons/fa";
import {
  useDeleteUserMutation,
  useGetAllUsersQuery,
} from "../../redux/api/user-api";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

const cols = [
  {
    Header: "Avatar",
    accessor: "avatar",
    Cell: (props) => (
      <img
        src={props.row.original.avatar}
        className="size-9 rounded-full object-cover my-1 "
      ></img>
    ),
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Gender",
    accessor: "gender",
  },
  {
    Header: "Email",
    accessor: "email",
  },
  {
    Header: "Role",
    accessor: "role",
  },
  {
    Header: "Action",
    accessor: "action",
    Cell: (props) => <DeleteUser userId={props.row.original.id}></DeleteUser>,
  },
];

const DeleteUser = ({ userId }) => {
  const [deleteUser] = useDeleteUserMutation();
  const { _id: adminUserId } = useSelector((state) => state.userSlice.user);

  const deletHandler = async () => {
    try {
      const res = await deleteUser({ userId, adminUserId });
      if (res?.error) {
        throw new Error("Can not delete user .please try again");
      }
      toast.success("user deleted successfully");
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <FaTrash onClick={deletHandler} className="text-red-500 cursor-pointer" />
  );
};

const Customer = () => {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState();

  const startIndex = (page - 1) * 8;
  const endIndex = startIndex + 8;

  const { _id } = useSelector((state) => state.userSlice.user);
  const { data, isLoading, isError, error } = useGetAllUsersQuery(_id);

  const users = data?.users;
  const usersSinglepage = users?.slice(startIndex, endIndex);
  const userTableData = usersSinglepage?.map((user) => {
    return {
      id: user._id,
      avatar: user.photo,
      name: user.name,
      gender: user.gender,
      email: user.email,
      role: user.role,
    };
  });

  useEffect(() => {
    if (data) {
      setTotalPages(Math.ceil(data.users.length / 8));
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

  if (isLoading) return <h1 className="text-center">Loading</h1>;
  if (isError) return <h1 className="text-center">Some Thing went wrong</h1>;
  return (
    <div className="w-full relative">
      <div className="flex justify-between m-2">
        <p className="font-bold text-2xl">Customer</p>
        <button className="rounded-full size-10 bg-slate-700 text-white text-xl flex justify-center items-center">
          +
        </button>
      </div>
      <div className="m-2 rounded-md shadow-lg p-2">
        <Table columns={cols} data={userTableData}></Table>
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

export default Customer;
