import { FaPlus, FaMinus } from "react-icons/fa";

const CartItem = ({
  productId,
  photo,
  name,
  price,
  quantity,
  removeOrder,
  incrementQuantity,
  decrementQuantity,
}) => {
  return (
    <div className="flex gap-4 mb-5">
      <div className="h-28 w-28 overflow-hidden ">
        <img
          className=" w-full h-full rounded-xl object-contain"
          src={`http://localhost:5000/${photo}`}
          alt="item"
        ></img>
      </div>
      <div className="flex items-baseline justify-between w-full ">
        <div>
          <p className="text-gray-700 text-lg">{name}</p>
          <p className="font-medium">${price}</p>
        </div>
        <div>
          <div className="flex gap-2 items-center">
            <button
              onClick={() => {
                decrementQuantity(productId);
              }}
              className="p-1 text-sm bg-gray-400 rounded-md grid place-content-center text-white hover:bg-black"
            >
              <FaMinus />
            </button>
            <p className="text-xl">{quantity}</p>
            <button
              onClick={() => {
                incrementQuantity(productId);
              }}
              className="p-1 text-sm bg-gray-400 rounded-md grid place-content-center text-white hover:bg-black"
            >
              <FaPlus />
            </button>
          </div>
          <button
            onClick={() => {
              removeOrder(productId);
            }}
            className="bg-gray-400 w-full mt-2 py-1 rounded-md text-white hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
