import express from "express";
import {
  allOrders,
  deleteOrderByID,
  getOrderByID,
  newOrder,
  updateOrderStatus,
  userOrders,
} from "../controllers/order.js";
import isAdmin from "../middlewares/isadmin.js";

const app = express.Router();

app.post("/new", newOrder);
app.get("/all-orders", isAdmin, allOrders);
app.get("/user-order", userOrders);
app
  .route("/:id")
  .get(getOrderByID)
  .put(isAdmin, updateOrderStatus)
  .delete(isAdmin, deleteOrderByID);
export default app;
