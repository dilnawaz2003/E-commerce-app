import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import toast from "react-hot-toast";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/api/v1/user" }),
  tagTypes: ["users"],
  endpoints: (builder) => ({
    newUser: builder.mutation({
      query: (user) => ({
        url: "new",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["users"],
    }),
    getAllUsers: builder.query({
      query: (adminId) => `/all?id=${adminId}`,
      providesTags: ["users"],
    }),
    getUserDetails: builder.query({
      query: (userId) => `/${userId}`,
      providesTags: ["users"],
    }),
    deleteUser: builder.mutation({
      query: ({ userId, adminUserId }) => {
        return {
          url: `/${userId}?id=${adminUserId}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["users"],
    }),
  }),
});

export const getUser = async (id) => {
  try {
    const response = await fetch(`http://localhost:5000/api/v1/user/${id}`);

    if (response.status === 400 || response.status === 500) {
      throw new Error("Failed To Fetch Data");
    }
    const data = await response.json();

    return data.user;
  } catch (error) {
    toast(error.message || "Failed To Fetch Data ");
  }
};

export const {
  useNewUserMutation,
  useGetAllUsersQuery,
  useGetUserDetailsQuery,
  useDeleteUserMutation,
} = userApi;
