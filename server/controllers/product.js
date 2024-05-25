import { validationResult } from "express-validator";
import ErrorHandler from "../utils/custom-error.js";
import productModel from "../models/product.js";
import { rm } from "fs";
import TryCatch from "../utils/try-catch.js";
import { cache } from "../index.js";
import invalidateCache from "../utils/invalidate-cache.js";

export const newProduct = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty())
      throw new ErrorHandler(500, "Please Enter Valid Product Details");
    const { name, price, stock, category } = req.body;

    const photo = req.file;

    if (!photo) throw new ErrorHandler(500, "Please Enter Valid Photo ");

    const newProduct = await productModel.create({
      name,
      price,
      stock,
      category: category.toLowerCase(),
      photo: photo.path,
    });
    invalidateCache({ product: true, admin: true });
    res.json({ success: true, product: newProduct });
  } catch (error) {
    if (req?.file?.path) {
      rm(req.file.path, () => console.log("Photo Deleted"));
    }
    next(error);
  }
};

export const getLatestProducts = TryCatch(async (req, res, next) => {
  let latestProducts = [];
  if (cache.has("latest-products")) {
    latestProducts = JSON.parse(cache.get("latest-products"));
  } else {
    latestProducts = await productModel
      .find({})
      .sort({ createdAt: -1 })
      .limit(5);

    cache.set("latest-products", JSON.stringify(latestProducts));
  }

  res.json({ success: true, latestProducts });
});

export const getAllCategories = TryCatch(async (req, res, next) => {
  let categories = [];
  if (cache.has("category")) {
    categories = JSON.parse(cache.get("category"));
  } else {
    categories = await productModel.distinct("category");
    cache.set("category", JSON.stringify(categories));
  }

  return res.json({ success: true, categories });
});

export const getAdminProducts = TryCatch(async (req, res, next) => {
  let products = [];
  if (cache.has("admin-products")) {
    products = JSON.parse(cache.get("admin-products"));
  } else {
    products = await productModel.find({});
    cache.set("admin-products", JSON.stringify(products));
  }
  res.json({ success: true, products });
});

export const getProductByID = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  let product;

  if (cache.has(`product-${id}`)) {
    product = JSON.parse(cache.get(`product-${id}`));
  } else {
    product = await productModel.findById(id);
    if (!product) throw new ErrorHandler(404, "Product Not Found");
    cache.set(`product-${id}`, JSON.stringify(product));
  }
  res.json({ success: true, product });
});

export const deleteProductByID = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const deletedProduct = await productModel.findByIdAndDelete(id);

  if (!deletedProduct) throw new ErrorHandler(404, "Could Not Delete Product");
  invalidateCache({ product: true, productIds: [id], admin: true });
  res.json({ success: true, deletedProduct });
});

export const updateProductByID = TryCatch(async (req, res, next) => {
  const { name, price, stock, category } = req.body;

  const { id } = req.params;
  const product = await productModel.findById(id);
  if (!product) throw new ErrorHandler(404, "Product Not Found");

  if (name) product.name = name;
  if (price) product.price = price;
  if (stock) product.stock = stock;
  if (category) product.category = category;

  if (req?.file?.path) {
    rm(product.photo, () => console.log("Deleted Old Photo"));
    product.photo = req.file.path;
  }

  const updatedProduct = await product.save();

  if (!name && !price && !stock && !category && !req?.file) {
    return res.json({
      success: false,
      msg: "Nothing was changed in product",
      product,
    });
  }
  invalidateCache({ product: true, productIds: [id], admin: true });
  return res.json({ success: true, updatedProduct });
});

export const getAllProducts = TryCatch(async (req, res, next) => {
  const { price, category, sort, search } = req.query;
  const page = Number(req.query?.page) || 1;
  const limit = 8;
  const skip = (page - 1) * limit;
  const baseQuery = {};

  if (search !== "") baseQuery.name = { $regex: search, $optionals: "i" };

  if (category !== "") baseQuery.category = category;

  if (price > 0) baseQuery.price = { $lte: Number(price) };

  const [productsSinglePage, totalProductsSearch] = await Promise.all([
    productModel
      .find(baseQuery)
      .sort({ price: sort === "asc" ? 1 : -1 })
      .skip(skip)
      .limit(limit),
    productModel.find(baseQuery),
  ]);

  const totalPages = Math.ceil(totalProductsSearch.length / limit);

  res.json({ success: true, productsSinglePage, totalPages });
});
