import userModel from "../models/user.js";
import productModel from "../models/product.js";
import orderModel from "../models/order.js";
import TryCatch from "../utils/try-catch.js";
// import moment from "moment/moment.js";
import { startOfMonth, endOfMonth, subMonths } from "date-fns";
import {
  calculatePercentage,
  getCategoriesRatio,
  getChartData,
} from "../utils/features.js";
import { cache } from "../index.js";

export const getDashboardStats = TryCatch(async (req, res, next) => {
  let stats = {};

  if (cache.has("dashboard-stats")) {
    stats = JSON.parse(cache.get("dashboard-stats"));
  } else {
    let currentDate = new Date();
    const thisMonth = {
      start: startOfMonth(currentDate),
      end: currentDate,
    };
    const previousMonth = {
      start: startOfMonth(subMonths(currentDate, 1)),
      end: endOfMonth(subMonths(currentDate, 1)),
    };

    const previousSixMonthDate = subMonths(currentDate, 6);

    const thisMonthUsersPromise = userModel.find({
      createdAt: {
        $gte: thisMonth.start,
        $lte: thisMonth.end,
      },
    });

    const previousMonthUsersPromise = userModel.find({
      createdAt: {
        $gte: previousMonth.start,
        $lte: previousMonth.end,
      },
    });

    const thisMonthProductsPromise = productModel.find({
      createdAt: {
        $gte: thisMonth.start,
        $lte: thisMonth.end,
      },
    });
    const previousMonthProductsPromise = productModel.find({
      createdAt: {
        $gte: previousMonth.start,
        $lte: previousMonth.end,
      },
    });

    const thisMonthOrdersPromise = orderModel.find({
      createdAt: {
        $gte: thisMonth.start,
        $lte: thisMonth.end,
      },
    });
    const previousMonthOrdersPromise = orderModel.find({
      createdAt: {
        $gte: previousMonth.start,
        $lte: previousMonth.end,
      },
    });

    const previousSixMonthsOrdersPrmoise = orderModel.find({
      createdAt: {
        $gte: previousSixMonthDate,
        $lte: currentDate,
      },
    });

    const latestTransactionsPromise = orderModel
      .find({})
      .sort({ createdAt: -1 })
      .select(["orderItems", "discount", "total", "status"])
      .limit(4);

    const [
      thisMonthUsers,
      thisMonthProducts,
      thisMonthOrders,
      previousMonthUser,
      previousMonthProducts,
      previousMonthOrders,
      productsCount,
      usersCount,
      allOrders,
      previousSixMonthsOrders,
      categories,
      femaleUsersCount,
      latestTransactions,
    ] = await Promise.all([
      thisMonthUsersPromise,
      thisMonthProductsPromise,
      thisMonthOrdersPromise,
      previousMonthUsersPromise,
      previousMonthProductsPromise,
      previousMonthOrdersPromise,
      productModel.countDocuments(),
      userModel.countDocuments(),
      orderModel.find({}),
      previousSixMonthsOrdersPrmoise,
      productModel.distinct("category"),
      userModel.countDocuments({ gender: "Female" }),
      latestTransactionsPromise,
    ]);

    const thisMonthRevenue = thisMonthOrders.reduce(
      (totalRevenue, currentOrder) => {
        return totalRevenue + currentOrder.total;
      },
      0
    );

    const previousMonthRevenue = previousMonthOrders.reduce(
      (totalRevenue, currentOrder) => {
        return totalRevenue + currentOrder.total;
      },
      0
    );

    const userChangePercent = calculatePercentage(
      thisMonthUsers.length,
      previousMonthUser.length
    );
    const productChangePercent = calculatePercentage(
      thisMonthProducts.length,
      previousMonthProducts.length
    );
    const orderChangePercent = calculatePercentage(
      thisMonthOrders.length,
      previousMonthOrders.length
    );

    const revenueChangePercent = calculatePercentage(
      thisMonthRevenue,
      previousMonthRevenue
    );

    const ordersCount = allOrders.length;
    const totalRevenue = allOrders.reduce((total, currentOrder) => {
      return total + currentOrder.total;
    }, 0);

    // we have order of 6 last  months
    // based on that we will calculate revenue of each month and
    // also orders in that month

    const monthlyOrders = getChartData(6, currentDate, previousSixMonthsOrders);
    const monthlyRevenue = getChartData(
      6,
      currentDate,
      previousSixMonthsOrders,
      "total"
    );

    const categoriesRatio = await getCategoriesRatio(categories, productsCount);

    const usersRatio = {
      female: femaleUsersCount,
      male: usersCount - femaleUsersCount,
    };

    // instead of of orderItems property we need it's length

    const latestTransactionsModified = latestTransactions.map((transaction) => {
      return {
        _id: transaction._id,
        discount: transaction.discount,
        amount: transaction.total,
        quantity: transaction.orderItems.length,
        status: transaction.status,
      };
    });

    stats = {
      percent: {
        userChangePercent,
        productChangePercent,
        orderChangePercent,
        revenueChangePercent,
      },
      count: {
        usersCount,
        productsCount,
        ordersCount,
        totalRevenue,
      },
      orderAndTransactionChart: {
        monthlyOrders,
        monthlyRevenue,
      },
      categoriesRatio,
      usersRatio,
      latestTransactions: latestTransactionsModified,
    };

    cache.set("dashboard-stats", JSON.stringify(stats));
  }

  res.json({
    success: true,
    stats,
  });
});

// Skiped --> REVENUE DISTRIBUTION.
export const getPieChartsStats = TryCatch(async (req, res, next) => {
  const key = "admin-pie-charts";
  let stats = {};

  if (cache.has(key)) {
    stats = JSON.parse(cache.get(key));
  } else {
    const [
      processingOrdersCount,
      shippedOrdersCount,
      deliverdOrdersCount,
      categories,
      allProductsCount,
      outOfStockProducts,
      usersDOB,
      customerUsers,
      adminUsers,
    ] = await Promise.all([
      orderModel.countDocuments({ status: "Processing" }),
      orderModel.countDocuments({ status: "Shipped" }),
      orderModel.countDocuments({ status: "Delivered" }),
      productModel.distinct("category"),
      productModel.countDocuments(),
      productModel.countDocuments({ stock: 0 }),
      userModel.find({}).select("dob"),
      userModel.countDocuments({ role: "User" }),
      userModel.countDocuments({ role: "Admin" }),
    ]);

    const categoriesRatio = await getCategoriesRatio(
      categories,
      allProductsCount
    );

    const usersAgeGroup = {
      teenagers: usersDOB.filter((i) => i.age < 24).length,
      adults: usersDOB.filter((i) => i.age > 24 && i.age <= 45).length,
      old: usersDOB.filter((i) => i.age > 45).length,
    };

    stats = {
      orderFullfilementRatio: {
        processingOrdersCount,
        shippedOrdersCount,
        deliverdOrdersCount,
      },
      categoriesRatio,
      stockAvailability: {
        inStockProducts: allProductsCount - outOfStockProducts,
        outOfStockProducts,
      },
      usersAgeGroup,
      userTypeCount: {
        admins: adminUsers,
        customers: customerUsers,
      },
    };

    cache.set(key, JSON.stringify(stats));
  }

  res.json({ success: true, stats });
});

export const getBarChartsStats = TryCatch(async (req, res, next) => {
  let stats = {};
  const key = "admin-bar-charts";

  if (cache.has(key)) {
    stats = JSON.parse(cache.get(key));
  } else {
    const currentDate = new Date();
    const prevSixMonthDate = subMonths(currentDate, 6);
    const prevTwelveMonthDate = subMonths(currentDate, 12);

    const baseQuery = {
      createdAt: { $gte: prevSixMonthDate, $lte: currentDate },
    };

    const [prevSixMonthUsers, prevSixMonthProducts, prevTwelveMonthOrders] =
      await Promise.all([
        userModel.find(baseQuery).select("createdAt"),
        productModel.find(baseQuery).select("createdAt"),
        orderModel
          .find({ createdAt: { $gte: prevTwelveMonthDate, $lte: currentDate } })
          .select("createdAt"),
      ]);

    const userMonthlyCounts = getChartData(6, currentDate, prevSixMonthUsers);
    const productMonthlyCounts = getChartData(
      6,
      currentDate,
      prevSixMonthProducts
    );
    const orderMonthlyCounts = getChartData(
      12,
      currentDate,
      prevTwelveMonthOrders
    );

    stats = {
      counts: {
        user: userMonthlyCounts,
        product: productMonthlyCounts,
        order: orderMonthlyCounts,
      },
    };

    cache.set(key, JSON.stringify(stats));
  }

  res.json({ success: true, stats });
});

export const getLineChartsStats = TryCatch(async (req, res, next) => {
  const key = "admin-line-charts";

  let stats = {};

  if (cache.has(key)) {
    stats = JSON.parse(cache.get(key));
  } else {
    const currentDate = new Date();
    const prevTwelveMonthDate = subMonths(currentDate, 12);

    const baseQuery = {
      createdAt: { $gte: prevTwelveMonthDate, $lte: currentDate },
    };

    const [prevTwelveMonthUsers, prevTwelveMonthProducts, orders] =
      await Promise.all([
        userModel.find(baseQuery).select("createdAt"),
        productModel.find(baseQuery).select("createdAt"),
        orderModel.find(baseQuery).select(["createdAt", "total", "discount"]),
      ]);

    const userMonthlyCounts = getChartData(
      12,
      currentDate,
      prevTwelveMonthUsers
    );
    const productMonthlyCounts = getChartData(
      12,
      currentDate,
      prevTwelveMonthProducts
    );

    const revenueMonthlyCount = getChartData(12, currentDate, orders, "total");
    const discountMonthlyCount = getChartData(
      12,
      currentDate,
      orders,
      "discount"
    );

    stats = {
      counts: {
        user: userMonthlyCounts,
        product: productMonthlyCounts,
        revenue: revenueMonthlyCount,
        discount: discountMonthlyCount,
      },
    };
  }

  res.json({ success: true, stats });
});
