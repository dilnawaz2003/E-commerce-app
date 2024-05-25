import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import voucher_codes from "voucher-code-generator";
import { useState } from "react";
import { useSelector } from "react-redux";

import { toast } from "react-hot-toast";

const Coupon = () => {
  const [couponCode, setCouponCode] = useState();
  const [generate, setGenerate] = useState(true);
  const [post, setPost] = useState(false);
  const [loading, setLoading] = useState(false);
  const { _id } = useSelector((state) => state.userSlice.user);

  const schema = z.object({
    charsLength: z.coerce
      .number()
      .min(15, "characters length should be at least 15"),
    amount: z.coerce
      .number()
      .min(1, "amount must be greater than or equal to 1"),
  });
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      charsLength: 15,
      amount: 500,
    },
  });

  const submitHandler = async (data) => {
    try {
      setLoading(true);
      if (generate) {
        const code = voucher_codes.generate({
          length: data.charsLength,
          charset: voucher_codes.charset("alphanumeric"),
        })[0];
        setCouponCode(code);
        setGenerate(false);
        setPost(true);
      } else {
        const response = await fetch(
          `http://localhost:5000/api/v1/payment/coupon/new?id=${_id}`,
          {
            method: "POST",
            body: JSON.stringify({
              amount: data.amount,
              coupon: couponCode,
              expiryDate: new Date(Date.now() + 1 * 60 * 1000),
            }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const resData = await response.json();

        if (!response.ok)
          throw Error(resData.message || "Failed to  upload coupon");

        toast.success("coupon uploaded");
        setCouponCode(null);
        setGenerate(true);
        setPost(false);
        reset();
      }
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3  ">
      <p className="font-bold uppercase text-xl">Coupon</p>
      <div className="flex justify-center items-start ">
        <form className="w-2/6 mt-4 " onSubmit={handleSubmit(submitHandler)}>
          <div className="flex flex-col gap-1 mb-2 ">
            <label>Characters length</label>
            <input
              {...register("charsLength")}
              type="number"
              className="border-2 rounded-md border-gray-400 outline-none p-1"
            ></input>
            {errors && errors.charsLength && (
              <p className="text-red-500">{errors.charsLength.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1 mb-2 ">
            <label>Discount Amount</label>
            <input
              {...register("amount")}
              type="number"
              className="border-2 rounded-md border-gray-400 outline-none p-1"
            ></input>
            {errors && errors.amount && (
              <p className="text-red-500">{errors.amount.message}</p>
            )}
          </div>
          {couponCode && <p>{couponCode}</p>}
          <div>
            <button className="uppercase bg-blue-500 text-white rounded-md w-full mt-4 py-2">
              {loading ? "loading" : generate ? "Generate" : "Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Coupon;
