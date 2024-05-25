import express from "express";
import { productValidation } from "../utils/validations.js";
import { singleUpload } from "../middlewares/multer.js";
import {
  deleteProductByID,
  getAdminProducts,
  getAllCategories,
  getAllProducts,
  getLatestProducts,
  getProductByID,
  newProduct,
  updateProductByID,
} from "../controllers/product.js";
import isAdmin from "../middlewares/isadmin.js";

const app = express.Router();

/* 
Routes to create 
post - new -> To Create New Product.
get - all -> To get all products after applying filters.
get - latest -> To get latest 10 products .
get - categories -> To get list of all unique categories(not products)
get - admin-products -> to get all products.

- :id to get, update , delete product
*/
app.post("/new", isAdmin, singleUpload, productValidation, newProduct);

app.get("/all", getAllProducts);

app.get("/latest", getLatestProducts);

app.get("/categories", getAllCategories);

app.get("/admin-products", getAdminProducts);

app
  .route("/:id")
  .get(getProductByID)
  .delete(isAdmin, deleteProductByID)
  .put(isAdmin, singleUpload, updateProductByID);

export default app;
