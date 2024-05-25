import { stripe } from "../index.js";
import couponModel from "../models/coupon.js";
import ErrorHandler from "../utils/custom-error.js";
import TryCatch from "../utils/try-catch.js";

export const createPaymentIntent = TryCatch(async (req, res, next) => {
  const { amount } = req.body;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Number(amount) * 100,
    currency: "usd",
  });

  res.json({
    success: true,
    clientSecret: paymentIntent.client_secret,
  });
});
export const newCoupon = TryCatch(async (req, res, next) => {
  const { coupon: code, amount } = req.body;

  const newCoupon = await couponModel.create({
    code,
    amount,
  });

  res.json({ success: true, coupon: newCoupon });
});

export const getAllCoupons = TryCatch(async (req, res, next) => {
  const coupons = await couponModel.find({});

  res.json({ success: true, coupons });
});

export const getCouponDiscount = TryCatch(async (req, res, next) => {
  const { coupon: code } = req.query;
  const coupon = await couponModel.find({ code });

  if (coupon.length === 0) return next(new ErrorHandler(404, "Invalid Coupon"));

  res.json({ success: true, amount: coupon[0].amount });
});

export const deleteCoupon = TryCatch(async (req, res, next) => {
  const { id } = req.params;

  if (!id) return next(new ErrorHandler(400, "please enter valid ID"));

  const deleteCoupon = couponModel.findByIdAndDelete(id);

  if (!deleteCoupon)
    return next(new ErrorHandler(400, "Could not delete Coupon"));

  res.json({ success: true, deleteCoupon });
});
