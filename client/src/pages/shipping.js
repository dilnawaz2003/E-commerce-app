import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { z } from "zod";
import { setShippingInfo } from "../redux/reducer/cart-slice";
import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

const Shipping = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  // const { state: clientSecret } = useLocation();
  const schema = z.object({
    address: z.string().min(1, "Adress is required "),
    city: z.string().min(1, "city is required "),
    state: z.string().min(1, "state is required "),
    country: z.string().min(1, "country is required "),
    pinCode: z.coerce.number().min(1, "pin code is required "),
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const { total } = useSelector((state) => state.cartSlice);

  const submitHandler = async (data) => {
    try {
      setIsLoading(true);
      dispatch(setShippingInfo(data));
      const response = await fetch(
        "http://localhost:5000/api/v1/payment/create",
        {
          method: "POST",
          body: JSON.stringify({ amount: total }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const { clientSecret } = await response.json();
      if (!response.ok) throw new Error("Some thing went wrong");
      navigate("/checkout", {
        state: clientSecret,
      });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-22 grid place-content-center text-center min-h-[calc(100vh+100px)]">
      <h1 className="font-bold uppercase mb-2">Shipping Address</h1>
      <form
        className="flex flex-col gap-4"
        onSubmit={handleSubmit(submitHandler)}
      >
        <div>
          <input
            {...register("address")}
            type="text"
            name="address"
            placeholder="Address"
            className="w-[250px] border border-[#006786] outline-[#006786] p-2 rounded-md"
          ></input>
          {errors && errors.address && errors.address.message && (
            <h1 className="m-0 p-0 text-red-500">{errors.address.message}</h1>
          )}
        </div>

        <div>
          <input
            {...register("city")}
            type="text"
            name="city"
            placeholder="City"
            className="w-[250px] border border-[#006786] outline-[#006786] p-2 rounded-md"
          ></input>
          {errors && errors.city && errors.city.message && (
            <h1 className="m-0 p-0 text-red-500">{errors.city.message}</h1>
          )}
        </div>

        <div>
          <input
            {...register("state")}
            type="text"
            name="state"
            placeholder="state"
            className="w-[250px] border border-[#006786] outline-[#006786] p-2 rounded-md"
          ></input>
          {errors && errors.state && errors.state.message && (
            <h1 className="m-0 p-0 text-red-500">{errors.state.message}</h1>
          )}
        </div>

        <div>
          <select
            {...register("country")}
            className="w-[250px] border border-[#006786] outline-[#006786] p-2 rounded-md"
          >
            <option value={null}>Country</option>
            <option value="pakistan">pakistan</option>
            <option value="usa">Usa</option>
          </select>
          {errors && errors.country && errors.country.message && (
            <h1 className="m-0 p-0 text-red-500">{errors.country.message}</h1>
          )}
        </div>

        <div>
          <input
            {...register("pinCode")}
            type="number"
            name="pinCode"
            placeholder="Pin Code"
            className="w-[250px] border border-[#006786] outline-[#006786] p-2 rounded-md"
          ></input>
          {errors && errors.pinCode && errors.pinCode.message && (
            <h1 className="m-0 p-0 text-red-500">{errors.pinCode.message}</h1>
          )}
        </div>

        <button
          disabled={isLoading}
          className="w-[250px] rounded-md text-white uppercase bg-[#006786]  py-1 "
        >
          {isLoading ? "Loading..." : "Pay Now"}
        </button>
      </form>
    </div>
  );
};

export default Shipping;
