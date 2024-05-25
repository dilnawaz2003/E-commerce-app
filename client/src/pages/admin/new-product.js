import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNewProductMutation } from "../../redux/api/product-api";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const NewProduct = () => {
  const [photoPreview, setPhotoPreview] = useState("");
  const [newProduct] = useNewProductMutation();
  const user = useSelector((state) => state.userSlice.user);
  const navigate = useNavigate();

  const schema = z.object({
    name: z.string().min(3),
    price: z.coerce.number().min(1),
    stock: z.coerce.number().min(1),
    category: z.string().min(1),
    photo: z
      .any()
      .refine((files) => files?.length >= 1, { message: "Image is required." }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const photoHandler = (e) => {
    const photoFile = e.target?.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      setPhotoPreview(e.target.result);
    };
    reader.readAsDataURL(photoFile);
  };

  const submitHandler = async (data) => {
    try {
      const formData = new FormData();

      formData.set("name", data.name);
      formData.set("price", data.price);
      formData.set("stock", data.stock);
      formData.set("category", data.category);
      formData.set("photo", data.photo[0]);

      await newProduct({ formData, id: user._id });
      navigate("/admin/product");
    } catch (e) {
      errors.root = e.message || "Some Thing Went Wrone Please Try Again";
    }
  };

  return (
    <div className="grid place-content-center h-screen  ">
      <div className="shadow-2xl rounded-md px-4 py-6 shadow-gray-500">
        <p className="uppercase font-bold text-center  ">New Product</p>
        <form onSubmit={handleSubmit(submitHandler)}>
          <div className="flex flex-col gap-1 ">
            <label>Name</label>
            <input
              {...register("name")}
              type="text"
              className="border-2 rounded-md border-gray-400 outline-none p-1"
              //   onChange={(e) => setName(e.target.value)}
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
              //   onChange={(e) => setPrice(e.target.value)}
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
              //   onChange={(e) => setStock(e.target.value)}
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
              //   onChange={(e) => setCategory(e.target.value)}
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
              type="file"
              className="border-2 rounded-md border-gray-400 outline-none p-1"
              onChange={photoHandler}
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
              {isSubmitting ? "Loading..." : "create"}
            </button>
          </div>
          <div>{errors && errors.root && <p>{errors.root.message}</p>}</div>
        </form>
      </div>
    </div>
  );
};

export default NewProduct;
