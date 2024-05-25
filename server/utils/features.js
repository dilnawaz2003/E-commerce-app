import { subMonths, format, addMonths } from "date-fns";
import productModel from "../models/product.js";

export const reduceStock = (orderItems) => {
  orderItems.forEach(async (element) => {
    const product = await productModel.findById(element.productId);
    if (product.stock > element.quantity) {
      product.stock -= element.quantity;
      product.save();
    }
  });
};

export const calculatePercentage = (thisMonth, previousMonth) => {
  if (previousMonth === 0) return thisMonth * 100;
  const percent = (thisMonth - previousMonth / previousMonth) * 100;
  return Number(percent.toFixed(0));
};

export const getCategoriesRatio = async (categories, total) => {
  const categoryCountPromise = categories.map((category) => {
    return productModel.countDocuments({ category });
  });

  const categoriesCountArray = await Promise.all(categoryCountPromise);

  const categoriesCount = categories.map((category, i) => {
    return {
      [category]: Math.round((categoriesCountArray[i] / total) * 100),
    };
  });

  return categoriesCount;
};

export const getChartData = (monthsLength, currentDate, data, property) => {
  const months = {};
  const prevDate = subMonths(currentDate, monthsLength);
  for (let i = 1; i <= monthsLength; i++) {
    const month = format(addMonths(prevDate, i), "LLL");
    months[month] = 0;
  }
  data.forEach((i) => {
    const month = format(i.createdAt, "LLL");
    if (property) {
      months[month] += i[property];
    } else {
      months[month] += 1;
    }
  });

  return months;
};
