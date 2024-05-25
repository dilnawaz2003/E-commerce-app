import { cache } from "../index.js";
import orderModel from "../models/order.js";
import ErrorHandler from "../utils/custom-error.js";
import { reduceStock } from "../utils/features.js";
import invalidateCache from "../utils/invalidate-cache.js";
import TryCatch from "../utils/try-catch.js";

export const newOrder = TryCatch(async (req, res, next) => {
  const {
    shippingInfo,
    user,
    subTotal,
    tax,
    shippingCharges,
    discount,
    total,
    orderItems,
  } = req.body;

  const newOrder = await orderModel.create({
    shippingInfo,
    user,
    subTotal,
    tax,
    shippingCharges,
    discount,
    total,
    orderItems,
  });

  // Reducing Stock from Product

  reduceStock(orderItems);
  invalidateCache({
    admin: true,
    product: true,
    order: true,
    userId: user,
    productIds: orderItems.map((i) => i.productId),
  });

  res.json({ success: true, newOrder });
});

export const allOrders = TryCatch(async (req, res, next) => {
  let orders = [];

  if (cache.has("all-orders")) {
    orders = JSON.parse(cache.get("all-orders"));
  } else {
    orders = await orderModel.find({}).populate("user");
    // if (orders.isEmpty()) return next(404, "No Orders Found");
    cache.set("all-orders", JSON.stringify(orders));
  }

  res.json({ success: true, orders });
});

export const userOrders = TryCatch(async (req, res, next) => {
  const { id: userId } = req.query;

  if (!userId) return next(new ErrorHandler(404, "Please Enter Valid ID"));
  let orders = [];

  if (cache.has(`user-orders-${userId}`)) {
    orders = JSON.parse(cache.get(`user-orders-${userId}`));
  } else {
    orders = await orderModel.find({ user: userId });

    // if (orders.length === 0)
    //   return next(new ErrorHandler(404, "No Orders Found"));
    cache.set(`user-orders-${userId}`, JSON.stringify(orders));
  }
  res.json({ success: true, orders });
});

export const getOrderByID = TryCatch(async (req, res, next) => {
  const { id } = req.params;

  if (!id) return next(new ErrorHandler(404, "Please Enter Valid ID"));

  let order;

  if (cache.has(`order-${id}`)) {
    order = JSON.parse(cache.get(`order-${id}`));
  } else {
    order = await orderModel.findById(id).populate("user");
    if (!order) return next(404, "Order not Found");
    cache.set(`order-${id}`, JSON.stringify(order));
  }

  res.json({ success: true, order });
});

export const updateOrderStatus = TryCatch(async (req, res, next) => {
  const { id: orderId } = req.params;

  if (!orderId) return next(new ErrorHandler(400, "Please Enter Valid Id"));

  const order = await orderModel.findById(orderId);

  if (!order) return next(new ErrorHandler(404, "Order Not Found"));

  const status = order.status;
  if (status === "Processing") order.status = "Shipped";
  else if (status === "Shipped") order.status = "Delivered";
  const updatedOrder = await order.save();

  invalidateCache({ order: true, orderId });

  res.json({ success: true, updatedOrder });
});
export const deleteOrderByID = TryCatch(async (req, res, next) => {
  const { id: orderId } = req.params;

  if (!orderId) return next(new ErrorHandler(400, "Please Enter Valid Id"));

  const deletedOrder = await productModel.findByIdAndDelete(orderId);

  if (!deletedOrder) throw new ErrorHandler(404, "Could Not Delete Order");

  invalidateCache({ order: true, orderId });
  res.json({ success: true, deletedOrder });
});
