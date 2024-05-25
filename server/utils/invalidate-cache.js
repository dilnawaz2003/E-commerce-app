import { cache } from "../index.js";
import productModel from "../models/product.js";
const invalidateCache = async ({
  product,
  order,
  admin,
  orderId,
  userId,
  productIds,
}) => {
  if (product) {
    const keys = [
      "latest-products",
      "category",
      "admin-products",
      "dashboard-stats",
    ];
    productIds?.forEach((id) => {
      keys.push(`product-${id}`);
    });
    cache.del(keys);
  }
  if (order) {
    const keys = ["all-orders", `user-orders-${userId}`, `order-${orderId}`];
    cache.del(keys);
  }

  if (admin) {
    const keys = [
      "dashboard-stats",
      "admin-pie-charts",
      "admin-bar-charts",
      "admin-line-charts",
    ];
    cache.del(keys);
  }
};

export default invalidateCache;
