import { useNavigate, useParams } from "react-router-dom";
import {
  useDeleteOrderMutation,
  useOrderDetailsQuery,
  useUpdateOrderMutation,
} from "../../redux/api/order-api";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { FaTrash } from "react-icons/fa";

const ManageTransaction = () => {
  const { id } = useParams();
  const { _id: userId } = useSelector((state) => state.userSlice.user);
  const navigate = useNavigate();

  const { data, isLoading, isError } = useOrderDetailsQuery(id);
  const [updateOrder] = useUpdateOrderMutation();
  const [deleteOrder] = useDeleteOrderMutation();

  if (isLoading) return <h1>Loading...</h1>;
  if (isError) return <h1>Some Thing Went Wrong</h1>;
  if (!data) return <h1>Failed To Get Order</h1>;

  const order = data.order;
  const color =
    order.status === "Processing"
      ? "red"
      : order.status === "Shipped"
      ? "purple"
      : "green";

  const updateHandler = async () => {
    const response = await updateOrder({ orderId: id, adminId: userId });
    if (response?.error) {
      toast.error(response?.error.data.message);
    } else {
      toast.success("Status Updated");
      navigate("/admin/transaction");
    }
  };
  const deleteHandler = async () => {
    try {
      const response = await deleteOrder({
        adminId: userId,
        orderId: id,
      });

      if (response?.error) {
        throw new Error("Can not delete Product.please try again");
      }
      toast.success("Order deleted ");
      navigate("/admin/transaction");
    } catch (e) {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="flex justify-center mt-10 gap-8 min-h-screen ">
      <div className="w-1/3  h-[calc(100vh-100px)] bg-white py-2 px-4 shadow-lg rounded-md overflow-auto">
        <p className="uppercase text-gray-500 tracking-widest text-center">
          order items
        </p>
        {order.orderItems.map((i) => {
          return (
            <div
              key={i.productId}
              className="flex justify-between items-center text-gray-500 mt-2"
            >
              <div className="flex justify-center items-center gap-2">
                <img
                  src={`http://localhost:5000/uploads/${i.photo}`}
                  alt="image"
                  className="size-12 rounded-md object-contain"
                ></img>
                <div>{i.name}</div>
              </div>
              <div>
                ${i.price} x {i.quantity} = ${i.price * i.quantity}
              </div>
            </div>
          );
        })}
      </div>
      <div className=" relative w-1/3 h-[calc(100vh-100px)] bg-white py-2 px-4 shadow-lg rounded-md">
        <div
          onClick={deleteHandler}
          className="text-red-500  border size-9 rounded-full p-2  flex justify-center items-center shadow- absolute top-[-13px] right-[-13px]  hover:rotate-12"
        >
          <FaTrash />
        </div>
        <p className="uppercase text-gray-500 tracking-widest text-center">
          user info
        </p>
        <div className="text-gray-500 mt-2">
          <div className="mb-3">
            <p className="font-medium text-black">User Info</p>
            <div className="pl-2">
              <p>Name: {order.user.name} </p>
              <p>Adress : {order.shippingInfo.address}</p>
            </div>
          </div>
          <div className="mb-3">
            <p className="font-medium text-black">Amount Info</p>
            <div className="pl-2">
              <p>Subtotal: {order.subTotal} </p>
              <p>Shipping Charges : {order.shippingCharges}</p>
              <p>Tax : {order.tax}</p>
              <p>Discount : {order.discount}</p>
              <p>Total : {order.total}</p>
            </div>
          </div>
          <div className="mb-3">
            <p className="font-medium text-black">Status Info</p>
            <p className={`text-${color}-500 pl-3`}>Status: {order.status} </p>
          </div>
          <div className="mb-3">
            <button
              onClick={updateHandler}
              className="uppercase bg-blue-500 text-white rounded-md w-full mt-4 py-2"
            >
              Process Status
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageTransaction;
