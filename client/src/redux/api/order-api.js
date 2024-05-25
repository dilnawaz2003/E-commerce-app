import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/api/v1/order/" }),
  tagTypes: ["orders"],
  endpoints: (builder) => ({
    newOrder: builder.mutation({
      query: (order) => ({ url: "/new", method: "POST", body: order }),
      invalidatesTags: ["orders"],
    }),
    myOrders: builder.query({
      query: (userId) => {
        return `/user-order?id=${userId}`;
      },
      providesTags: ["orders"],
    }),
    allOrders: builder.query({
      query: (adminId) => `/all-orders?id=${adminId}`,
      providesTags: ["orders"],
    }),
    orderDetails: builder.query({
      query: (orderId) => `/${orderId}`,
      providesTags: ["orders"],
    }),
    updateOrder: builder.mutation({
      query: ({ orderId, adminId }) => {
        console.log(adminId);
        return { url: `/${orderId}?id=${adminId}`, method: "PUT" };
      },
      invalidatesTags: ["orders"],
    }),
    deleteOrder: builder.mutation({
      query: ({ orderId, adminId }) => ({
        url: `/${orderId}?id=${adminId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["orders"],
    }),
  }),
});

export const {
  useNewOrderMutation,
  useMyOrdersQuery,
  useAllOrdersQuery,
  useOrderDetailsQuery,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
} = orderApi;
