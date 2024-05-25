import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { addToCart } from "../redux/reducer/cart-slice";
import toast from "react-hot-toast";

const ProductCard = ({ name, price, photo, productId, stock }) => {
  const dispatch = useDispatch();

  const addToCartHandler = () => {
    if (stock >= 1) {
      dispatch(
        addToCart({ name, price, photo, quantity: 1, productId, stock })
      );
    } else {
      toast.error("product out of stock");
    }
  };

  return (
    <div className="w-48 relative group">
      <div className="p-2">
        <img
          className="h-52 w-full object-contain"
          src={`http://localhost:5000/${photo}`}
        ></img>
        <p className="text-gray-700">{name}</p>
        <p className="font-medium">$ {price}</p>
      </div>
      <div className="absolute group-hover:h-full group-hover:w-full group-hover:bg-black top-0 group-hover:opacity-50 rounded-lg transition-opacity duration-1000 opacity-0">
        <div className="hidden text-white group-hover:flex flex-col gap-3 justify-center items-center h-full">
          <Link to="" className="hover:underline">
            View Item
          </Link>
          <button onClick={addToCartHandler} className="hover:underline">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
