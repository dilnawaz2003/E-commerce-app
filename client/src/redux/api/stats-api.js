import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const statsApi = createApi({
  reducerPath: "statsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/api/v1/stats" }),
  endpoints: (builder) => ({
    dashboardStats: builder.query({
      query: (adminId) => `/dashboard-stats?id=${adminId}`,
      keepUnusedDataFor: 0,
    }),
    barChartsData: builder.query({
      query: (adminId) => `/admin-bar?id=${adminId}`,
      keepUnusedDataFor: 0,
    }),
    pieChartsData: builder.query({
      query: (adminId) => `/admin-pie?id=${adminId}`,
      keepUnusedDataFor: 0,
    }),
    lineChartsData: builder.query({
      query: (adminId) => `/admin-line?id=${adminId}`,
      keepUnusedDataFor: 0,
    }),
  }),
});

export const {
  useDashboardStatsQuery,
  useBarChartsDataQuery,
  usePieChartsDataQuery,
  useLineChartsDataQuery,
} = statsApi;
