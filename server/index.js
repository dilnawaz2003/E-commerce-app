import bodyParser from "body-parser";
import { config } from "dotenv";
import express from "express";
import mongoose from "mongoose";
import NodeCache from "node-cache";
import Stripe from "stripe";
import corsMiddleware from "./middlewares/cors.js";
import errrorMiddleware from "./middlewares/error.js";
import orderRoutes from "./routes/order.js";
import paymentRoutes from "./routes/payment.js";
import productRoutes from "./routes/product.js";
import statsRoutes from "./routes/stats.js";
import userRoutes from "./routes/user.js";
config();

const app = express();
export const stripe = new Stripe(process.env.STRIPE_KEY);
export const cache = new NodeCache();
// invalidateCache({ product: true });
app.use(corsMiddleware);
app.use("/uploads", express.static("/uploads"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/v1/user/", userRoutes);
app.use("/api/v1/product/", productRoutes);
app.use("/api/v1/order/", orderRoutes);
app.use("/api/v1/payment/", paymentRoutes);
app.use("/api/v1/stats", statsRoutes);

// Error Middleware
app.use(errrorMiddleware);

const main = async () => {
  try {
    const uri = process.env.MONGO_URI;
    const port = process.env.PORT;
    await mongoose.connect(uri);
    app.listen(port, (req, res) => console.log("Server Runing on port 5000"));
  } catch (e) {
    console.log(e);
    console.log("error connecting database");
  }
};

main();
