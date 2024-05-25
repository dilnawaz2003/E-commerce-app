import {
  FaCartPlus,
  FaHome,
  FaSearch,
  FaShoppingBag,
  FaSignInAlt,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "firebase/auth";
import toast from "react-hot-toast";
import { auth } from "../firebase";
import { unSetUser } from "../redux/reducer/user-slice";

const Navbar = () => {
  const { user } = useSelector((state) => state.userSlice);
  const dispatch = useDispatch();
  const SigOutHandler = async () => {
    try {
      await signOut(auth);
      dispatch(unSetUser());
      toast.success("Signed Out Succesfully");
    } catch (error) {
      toast.error("Failed To Sign Out");
    }
  };

  return (
    <nav className="flex justify-end items-center  gap-5 p-4 text-gray-500 border-b-2 shadow-lg fixed top-0 w-full bg-white z-10">
      <Link to="/" className="flex items-center gap-1">
        <FaHome />
        <span>Home</span>
      </Link>
      <Link to="/search" className="flex items-center gap-1">
        <FaSearch />
        Search
      </Link>
      <Link to="/cart" className="flex items-center gap-1">
        <FaCartPlus />
        Cart
      </Link>
      {!user && (
        <Link to="/login" className="flex items-center gap-1">
          <FaSignInAlt />
          Login
        </Link>
      )}

      {user && (
        <React.Fragment>
          <Link to="/admin/dashboard" className="flex items-center gap-1">
            <FaUser />
            Admin
          </Link>
          <Link to="/orders" className="flex items-center gap-1">
            <FaShoppingBag />
            Orders
          </Link>
          <Link onClick={SigOutHandler} className="flex items-center gap-1">
            <FaSignOutAlt />
            Sign Out
          </Link>
        </React.Fragment>
      )}
    </nav>
  );
};

export default Navbar;
