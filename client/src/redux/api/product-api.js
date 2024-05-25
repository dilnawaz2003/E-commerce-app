import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/v1/product",
  }),
  tagTypes: ["products"],
  endpoints: (builder) => ({
    singleProduct: builder.query({ query: ({ id }) => `/${id}` }),
    latestProducts: builder.query({
      query: () => "/latest",
      providesTags: ["products"],
    }),
    allProducts: builder.query({
      query: () => "/admin-products",
      providesTags: ["products"],
    }),
    categories: builder.query({
      query: () => "/categories",
      providesTags: ["products"],
    }),
    newProduct: builder.mutation({
      query: ({ formData, id }) => {
        return {
          url: `/new?id=${id}`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["products"],
    }),
    updateProduct: builder.mutation({
      query: ({ formData, adminId, productId }) => {
        return {
          url: `/${productId}?id=${adminId}`,
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags: ["products"],
    }),
    deleteProduct: builder.mutation({
      query: ({ productId, adminId }) => ({
        url: `/${productId}?id=${adminId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["products"],
    }),
    searchedProducts: builder.query({
      query: ({ page, category, sort, search, price }) =>
        `/all?page=${page}&category=${category}&sort=${sort}&search=${search}&price=${price}`,
      providesTags: ["products"],
    }),
  }),
});

export { productApi };
export const {
  useSingleProductQuery,
  useLatestProductsQuery,
  useAllProductsQuery,
  useCategoriesQuery,
  useNewProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useSearchedProductsQuery,
} = productApi;
