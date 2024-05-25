import { useLocation, useNavigate } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useDispatch, useSelector } from "react-redux";

import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import toast from "react-hot-toast";
import { useNewOrderMutation } from "../redux/api/order-api";
import { resetCart } from "../redux/reducer/cart-slice";
import { useState } from "react";

const CheckoutForm = () => {
  const {
    orderItems,
    tax,
    shippingCharges,
    subTotal,
    total,
    discount,
    shippingInfo,
  } = useSelector((state) => state.cartSlice);
  const [loading, setIsLoading] = useState(false);

  const { _id } = useSelector((state) => state.userSlice.user);
  const dispatch = useDispatch();
  const [newOrder] = useNewOrderMutation();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin,
      },
      redirect: "if_required",
    });

    if (result.error) {
      toast.error(result.error.message);
      return;
    }

    if (result.paymentIntent.status === "succeeded") {
      const res = await newOrder({
        tax,
        shippingCharges,
        subTotal,
        total,
        discount,
        shippingInfo,
        orderItems,
        user: _id,
      });
      if (!res.error) {
        toast.success("Order placed");
        dispatch(resetCart());
        navigate("/orders");
      } else {
        toast.error("Some Thing Went Wrong");
      }
      setIsLoading(false);
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button
        disabled={!stripe}
        className="w-full mt-3 rounded-md text-white uppercase bg-[#006786]  py-1 "
      >
        {loading ? "Proccessing" : "Submit"}
      </button>
    </form>
  );
};

export const CheckOut = () => {
  const { state: clientSecret } = useLocation();
  const stripePromise = loadStripe(
    "pk_test_51PBGk7P0zPOZfkPCnqIi6zTNn2W3nX2F6R5tm8wR3vN4nLd7sZF6J1Wgo1WTneMViJMz9wTOmtMTDULvledPuRLj00yzEITyil"
  );
  const options = {
    clientSecret: clientSecret,
  };
  return (
    <Elements stripe={stripePromise} options={options}>
      <div className="py-[110px] w-full flex justify-center">
        <CheckoutForm />
      </div>
    </Elements>
  );
};
