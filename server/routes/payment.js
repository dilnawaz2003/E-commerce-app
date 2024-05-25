import express from "express";
import {
  deleteCoupon,
  getAllCoupons,
  getCouponDiscount,
  newCoupon,
} from "../controllers/payment.js";
import isAdmin from "../middlewares/isadmin.js";
import { createPaymentIntent } from "../controllers/payment.js";

const app = express.Router();

app.post("/create", createPaymentIntent);
app.post("/coupon/new", isAdmin, newCoupon);
app.get("/coupon/all", isAdmin, getAllCoupons);
app.get("/coupon/discount", isAdmin, getCouponDiscount);
app.delete("/coupon/:id", isAdmin, deleteCoupon);

export default app;
