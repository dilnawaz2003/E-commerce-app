import { configureStore } from "@reduxjs/toolkit";
import { userApi } from "./api/user-api";
import { userSlice } from "./reducer/user-slice";
import { productApi } from "./api/product-api";
import { cartSlice } from "./reducer/cart-slice";
import { orderApi } from "./api/order-api";
import { statsApi } from "./api/stats-api";

const store = configureStore({
  reducer: {
    // User
    [userApi.reducerPath]: userApi.reducer,
    [userSlice.name]: userSlice.reducer,
    // Product
    [productApi.reducerPath]: productApi.reducer,
    // cart
    [cartSlice.name]: cartSlice.reducer,
    //order
    [orderApi.reducerPath]: orderApi.reducer,
    // Stats
    [statsApi.reducerPath]: statsApi.reducer,
  },
  middleware: (getMiddlewares) => [
    ...getMiddlewares(),
    userApi.middleware,
    productApi.middleware,
    orderApi.middleware,
    statsApi.middleware,
  ],
});

export default store;
