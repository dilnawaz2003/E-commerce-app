import mongoose from "mongoose";

const couponSchema = mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  expiryDate: {
    type: Date,
    default: new Date(),
    index: { expires: "1w" },
  },
});

const couponModel = mongoose.model("Coupon", couponSchema);

export default couponModel;
