import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import CartItem from "../Components/cart-item";
import {
  applyDiscount,
  decrementQuantity,
  incrementQuantity,
  removeFromCart,
} from "../redux/reducer/cart-slice";

import { useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [coupon, setCoupon] = useState("");
  const [couponAmount, setCouponAmount] = useState();
  const [couponMSG, setCouponMSG] = useState("");
  const controller = new AbortController();

  const {
    orderItems: orders,
    tax,
    shippingCharges,
    subTotal,
    total,
    discount,
  } = useSelector((state) => state.cartSlice);

  const user = useSelector((state) => state.userSlice.user);

  const removeOrderHandler = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const incrementQuantityHandler = (productId) => {
    dispatch(incrementQuantity(productId));
  };
  const decrementQuantityHandler = (productId) => {
    dispatch(decrementQuantity(productId));
  };

  useEffect(() => {
    const getDiscount = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/v1/payment/coupon/discount?id=${user._id}&coupon=${coupon}`,
          {
            signal: controller.signal,
          }
        );
        const data = await response.json();

        if (!response.ok)
          throw Error(data.message || "Failed to  validate coupon");

        setCouponAmount(data.amount);
        setCouponMSG(`$${data.amount} coupun applied `);
        dispatch(applyDiscount(data.amount));
      } catch (error) {
        setCouponMSG(error.message);
        dispatch(applyDiscount(0));
        toast.error(error.message);
      }
    };

    const timeOutID = setTimeout(() => {
      if (coupon !== "") {
        getDiscount();
      }
    }, 1000);

    return () => {
      setCouponMSG("");
      clearTimeout(timeOutID);
      setCouponAmount(null);
      dispatch(applyDiscount(0));
      controller.abort();
    };
  }, [coupon]);

  let content = <h1 className="text-center text-2xl">No items in cart</h1>;

  if (orders.length != 0) {
    content = orders.map((order) => {
      return (
        <CartItem
          key={order.productId}
          productId={order.productId}
          name={order.name}
          price={order.price}
          photo={order.photo}
          quantity={order.quantity}
          removeOrder={removeOrderHandler}
          incrementQuantity={incrementQuantityHandler}
          decrementQuantity={decrementQuantityHandler}
        ></CartItem>
      );
    });
  }
  return (
    <div className="px-16 py-20 flex">
      <div className=" w-3/4 p-4">{content}</div>
      <div className="w-1/4 h-screen fixed right-0 p-2 flex flex-col gap-y-4">
        <div>
          <p className="text-gray-500">Sub Total : {subTotal}</p>
          <p className="text-gray-500">Shipping Charges : {shippingCharges}</p>
          <p className="text-gray-500">Tax : {tax}</p>
          <p className="text-gray-500">Discount: {discount}</p>
          <p className="font-medium">Total : {total}</p>
        </div>
        <div>
          <input
            onChange={(e) => {
              setCoupon(e.target.value);
            }}
            className="rounded-sm mb-2 w-full py-1 outline-1 outline-[#006786] border-x border-y border-[#006786]"
          ></input>
          <p
            className={`${
              couponAmount ? "text-green-500" : "text-red-500"
            } mb-2`}
          >
            {couponMSG !== "" ? couponMSG : ""}
          </p>
          <button
            onClick={() => navigate("/shipping")}
            disabled={orders.length === 0}
            className="rounded-sm text-white uppercase bg-[#006786] w-full py-1 "
          >
            CheckOut
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
