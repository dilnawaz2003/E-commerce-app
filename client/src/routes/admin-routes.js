import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/admin/dashboard";
import Product from "../pages/admin/product";
import Sidebar from "../Components/admin/sidebar";
import Customer from "../pages/admin/customer";
import Transaction from "../pages/admin/transaction";
import NewProduct from "../pages/admin/new-product";
import ManageProduct from "../pages/admin/manage-product";
import ManageTransaction from "../pages/admin/manage-transaction";
import BarChartPage from "../pages/admin/bar-chart-page";
import LineChartPage from "../pages/admin/line-chart-page";
import PieChartPage from "../pages/admin/pie-chart-page";
import Coupon from "../pages/admin/coupon";
import { useSelector } from "react-redux";
import Navbar from "../Components/navbar";

const AdminRoutes = () => {
  const { user } = useSelector((state) => state.userSlice);
  return (
    <div className="flex box-border ">
      <Sidebar />
      <div className="ml-[20%] w-full ">
        <Routes>
          <Route>
            <Route path="/dashboard" element={<Dashboard />}></Route>
            <Route path="/product" element={<Product />}></Route>
            <Route path="/customer" element={<Customer />}></Route>
            <Route path="/transaction" element={<Transaction />}></Route>
            <Route path="/product/new" element={<NewProduct />}></Route>
            <Route
              path="/product/:id"
              element={<ManageProduct></ManageProduct>}
            ></Route>
            <Route
              path="/transaction/:id"
              element={<ManageTransaction />}
            ></Route>
            <Route path="/chart/bar" element={<BarChartPage />}></Route>
            <Route path="/chart/pie" element={<PieChartPage />}></Route>
            <Route path="/chart/line" element={<LineChartPage />}></Route>
            <Route path="/app/coupon" element={<Coupon />}></Route>
          </Route>
        </Routes>
      </div>
    </div>
  );
};

export default AdminRoutes;
