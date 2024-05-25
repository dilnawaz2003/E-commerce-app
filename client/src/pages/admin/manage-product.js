import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import {
  useDeleteProductMutation,
  useSingleProductQuery,
  useUpdateProductMutation,
} from "../../redux/api/product-api";
import { FaTrash } from "react-icons/fa";

const ManageProduct = () => {
  const schema = z.object({
    name: z.string().min(3),
    price: z.coerce.number().min(1),
    stock: z.coerce.number().min(1),
    category: z.string().min(1),
    photo: z.any(),
  });

  const { id } = useParams();
  const [photoPreview, setPhotoPreview] = useState("");
  const [updateProduct] = useUpdateProductMutation();
  const [deletedProduct] = useDeleteProductMutation();
  const user = useSelector((state) => state.userSlice.user);
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useSingleProductQuery({ id });
  const product = data?.product;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: data?.product?.name,
      price: product?.price,
      stock: product?.stock,
      category: product?.category,
      photo: product?.photo,
    },
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (!isError && !isLoading) {
      reset({
        name: data?.product?.name,
        price: product?.price,
        stock: product?.stock,
        category: product?.category,
        photo: product?.photo,
      });
    }
  }, [isError, isLoading]);

  const submitHandler = async (data) => {
    try {
      const formData = new FormData();

      formData.set("name", data.name);
      formData.set("price", data.price);
      formData.set("stock", data.stock);
      formData.set("category", data.category);

      if (data?.photo) {
        formData.set("photo", data.photo[0]);
      }

      const response = await updateProduct({
        formData,
        adminId: user._id,
        productId: product._id,
      });

      if (response?.error) {
        throw new Error("Can not Update Product.please try again");
      }
      toast.success("Product updated ");
      navigate("/admin/product");
    } catch (e) {
      toast.error("Failed to Update");
      errors.root = {
        message: e.message || "Some Thing Went Wrone Please Try Again",
      };
    }
  };

  const photoHandler = (e) => {
    const photoFile = e.target?.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      setPhotoPreview(e.target.result);
    };
    reader.readAsDataURL(photoFile);
  };

  const deleteHandler = async () => {
    try {
      const response = await deletedProduct({
        adminId: user._id,
        productId: product._id,
      });

      if (response?.error) {
        throw new Error("Can not delete Product.please try again");
      }
      toast.success("Product deleted ");
      navigate("/admin/product");
    } catch (e) {
      toast.error("Failed to delete");
      errors.root = {
        message: e.message || "Some Thing Went Wrone Please Try Again",
      };
    }
  };

  return isLoading ? (
    <h1>Loading...</h1>
  ) : isError ? (
    <h1>Some Thing Went Wrong</h1>
  ) : (
    <div className="w-full flex justify-center items-center  gap-8 min-h-screen ">
      <div className="w-1/3 bg-white p-2 rounded-sm shadow-xl">
        <p className="text-green-400 text-end mb-1 mr-1 uppercase text-lg">
          {product.stock} available
        </p>
        <div className="px-5">
          <p>ID : {product._id}</p>
          <img
            src={`http://localhost:5000/${product.photo}`}
            alt="product image"
            className="h-80 w-full object-contain my-3"
          ></img>
          <div className="text-start text-xl">
            <p className="text-gray-600">{product.name}</p>
            <p className="font-bold ">${product.price}</p>
          </div>
        </div>
      </div>
      <div className="w-1/3 bg-white p-5 rounded-sm shadow-xl relative ">
        <div
          onClick={deleteHandler}
          className="text-red-500  border size-9 rounded-full p-2  flex justify-center items-center shadow- absolute top-[-13px] right-[-13px]  hover:rotate-12"
        >
          <FaTrash />
        </div>
        <p className="font-bold text-center uppercase">Manage</p>
        <form onSubmit={handleSubmit(submitHandler)}>
          <div className="flex flex-col gap-1 ">
            <label>Name</label>
            <input
              {...register("name")}
              type="text"
              className="border-2 rounded-md border-gray-400 outline-none p-1"
            ></input>
            {errors && errors.name && (
              <p className="text-red-500">
                {errors.name.message.replace("String", "Name")}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1 ">
            <label>Price</label>
            <input
              {...register("price")}
              type="number"
              className="border-2 rounded-md border-gray-400 outline-none p-1"
            ></input>
            {errors && errors.price && (
              <p className="text-red-500">
                {errors.price.message.replace("Number", "Price")}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1 ">
            <label>Stock</label>
            <input
              {...register("stock")}
              type="number"
              className="border-2 rounded-md border-gray-400 outline-none p-1"
            ></input>
            {errors && errors.stock && (
              <p className="text-red-500">{errors.stock.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1 ">
            <label>Category</label>
            <input
              {...register("category")}
              type="text"
              className="border-2 rounded-md border-gray-400 outline-none p-1"
            ></input>
            {errors && errors.category && (
              <p className="text-red-500">
                {errors.category.message.replace("String", "Category")}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1 ">
            <label>Photo</label>
            <input
              {...register("photo")}
              onChange={photoHandler}
              type="file"
              className="border-2 rounded-md border-gray-400 outline-none p-1"
            ></input>
            {errors && errors.photo && (
              <p className="text-red-500">{errors.photo.message}</p>
            )}
            {photoPreview && (
              <img
                src={photoPreview}
                className="h-28 my-1 w-full object-contain"
              ></img>
            )}
          </div>

          <div>
            <button
              disabled={isSubmitting}
              className="uppercase bg-blue-500 text-white rounded-md w-full mt-4 py-2"
            >
              {isSubmitting ? "Loading..." : "Update"}
            </button>
          </div>
          <div>{errors && errors.root && <p>{errors.root.message}</p>}</div>
        </form>
      </div>
    </div>
  );
};

export default ManageProduct;

