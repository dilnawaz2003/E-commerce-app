import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "../pages/home";
import Search from "../pages/search";
import Cart from "../pages/cart";
import Shipping from "../pages/shipping";
import Login from "../pages/login";
import Order from "../pages/order";

import Navbar from "../Components/navbar";
import ProtectedRoute from "../Components/protected-route";
import { useSelector } from "react-redux";
import { CheckOut } from "../pages/checkout";

const UserRoutes = () => {
  const { user } = useSelector((state) => state.userSlice);
  return (
    <div className="box-border">
      <Navbar />
      <Routes>
        <Route index element={<Home />}></Route>
        <Route path="/search" element={<Search />}></Route>
        <Route path="/cart" element={<Cart />}></Route>

        <Route
          element={
            <ProtectedRoute
              isAuthenticated={user ? true : false}
              isAdminRoute={false}
            />
          }
        >
          <Route path="/shipping" element={<Shipping />}></Route>
        </Route>

        {/* If user is loged in he is not allowed to go again to login page*/}
        <Route
          element={
            <ProtectedRoute
              isAuthenticated={user ? false : true}
              isAdminRoute={false}
            />
          }
        >
          <Route path="/login" element={<Login />}></Route>
        </Route>

        <Route
          element={
            <ProtectedRoute
              isAuthenticated={user ? true : false}
              isAdminRoute={false}
            />
          }
        >
          <Route path="/orders" element={<Order />}></Route>
        </Route>

        <Route
          element={
            <ProtectedRoute
              isAuthenticated={user ? true : false}
              isAdminRoute={false}
            />
          }
        >
          <Route path="/checkout" element={<CheckOut />}></Route>
        </Route>
      </Routes>
    </div>
  );
};

export default UserRoutes;
