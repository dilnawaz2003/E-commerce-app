import { useEffect, useState } from "react";
import ProductCard from "../Components/product-card";
import {
  useAllProductsQuery,
  useCategoriesQuery,
  useSearchedProductsQuery,
} from "../redux/api/product-api";

const Search = () => {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState("");
  const [price, setPrice] = useState("");

  const {
    data: categoriesData,
    isLoading: isLoadingCategories,
    isError: isErrorCategories,
    error: errorCategories,
  } = useCategoriesQuery();

  const categories = categoriesData?.categories;

  const {
    data: productsData,
    isLoading: isLoadingProducts,
    isError: isErrorProducts,
    error: errorProducts,
    refetch,
  } = useSearchedProductsQuery({ page, category, sort, search, price });

  if (isErrorProducts) {
    console.log(errorProducts);
  }
  const products = productsData?.productsSinglePage;
  const totalPages = productsData?.totalPages;

  useEffect(() => {
    refetch({ page, category, sort, search, price });
  }, [page, category, search, sort, price]);

  const moveBackHandler = () => {
    if (page > 1) setPage((prevPage) => prevPage - 1);
  };

  const moveForwardHandler = () => {
    if (page < totalPages) setPage((prevPage) => prevPage + 1);
  };

  return (
    <div className="pl-2 py-20 flex ">
      <div className=" w-1/5 flex flex-col gap-4 shadow-2xl h-screen fixed p-4">
        <p className="uppercase text-gray-500 text-xl">F i l t e r s</p>
        <div>
          <p className="font-medium">Sort</p>
          <select
            onChange={(e) => {
              setSort(e.target.value);
            }}
            className="border-2 rounded-md border-gray-400 p-1 outline-0 w-full mt-1"
          >
            <option value="">None</option>
            <option value="asc">Price (Low To High)</option>
            <option value="dsc">Price (High To Low)</option>
          </select>
        </div>
        <div>
          <p className="font-medium">Category</p>
          <select
            onChange={(e) => {
              setCategory(e.target.value);
            }}
            className="border-2 rounded-md border-gray-400 p-1 outline-0 w-full mt-1"
          >
            <option value="">All</option>
            {!isLoadingCategories &&
              !isErrorCategories &&
              categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
          </select>
        </div>
        <div>
          <p className="font-medium">Max Price : {price}</p>
          <input
            onChange={(e) => setPrice(e.target.value)}
            type="range"
            min="1"
            max="100000"
            class="appearance-none w-full bg-transparent [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-black/25 [&::-webkit-slider-thumb]:appearance-none  [&::-webkit-slider-thumb]:w-[15px] [&::-webkit-slider-thumb]:h-[15px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gray-500"
          ></input>
        </div>
      </div>
      <div className=" w-full flex flex-col gap-4 pl-[25%]  min-h-[calc(100vh-100px)] ">
        <p className="uppercase text-gray-500 text-xl ">P r o d u c t s</p>
        <input
          placeholder="Search by name..."
          className="border-none outline-none"
          onChange={(e) => setSearch(e.target.value)}
        ></input>
        <div className="flex flex-wrap gap-5 items-center justify-center">
          {isLoadingProducts ? (
            <h1>Loading...</h1>
          ) : isErrorProducts ? (
            <h1>Some Thing Went Wrong Please Try Again.</h1>
          ) : (
            products &&
            products.map((p) => {
              return (
                <ProductCard
                  key={p._id}
                  name={p.name}
                  price={p.price}
                  photo={p.photo}
                  productId={p._id}
                  stock={p.stock}
                ></ProductCard>
              );
            })
          )}
        </div>
        <div className="flex justify-center items-center gap-4 bg w-full  mt-auto">
          <button
            className="rounded-md px-2 py-1 text-white bg-[#006786] "
            onClick={moveBackHandler}
          >
            Previous
          </button>
          <p>
            {page} of {totalPages}
          </p>
          <button
            className="rounded-md px-2 py-1 text-white bg-[#006786] "
            onClick={moveForwardHandler}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Search;
//
