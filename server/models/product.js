import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    name: {
      required: true,
      type: String,
    },
    photo: {
      required: true,
      type: String,
    },
    price: {
      required: true,
      type: Number,
    },
    stock: {
      required: true,
      type: Number,
    },
    category: {
      required: true,
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const productModel = mongoose.model("Product", productSchema);

export default productModel;
