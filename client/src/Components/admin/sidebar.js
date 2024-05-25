import {
  RiDashboardFill,
  RiCoupon3Fill,
  RiShoppingBag3Fill,
} from "react-icons/ri";
import { AiFillFileText } from "react-icons/ai";
import { IoIosPerson, tre } from "react-icons/io";
import { FaChartBar, FaChartLine, FaChartPie } from "react-icons/fa";
import { useLocation } from "react-router-dom";

import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="bg-gray-100 w-1/5 h-screen p-2 overflow-y-auto fixed  ">
      <h1 className="font-medium text-2xl uppercase">
        <Link to="/">Ecommerce</Link>
      </h1>
      <div className="p-4 w-full">
        <h1 className="uppercase text-gray-600 mb-1 tracking-widest">
          dashbaord
        </h1>

        <Li url="/admin/dashboard">
          <RiDashboardFill />
          <span>Dashboard</span>
        </Li>
        <Li url="/admin/product">
          <RiShoppingBag3Fill />
          <span>Product</span>
        </Li>
        <Li url="/admin/customer">
          <IoIosPerson />
          <span>Customer</span>
        </Li>
        <Li url="/admin/transaction">
          <AiFillFileText />
          <span>Transaction</span>
        </Li>
      </div>

      <div className="p-4">
        <h1 className="uppercase text-gray-600 mb-1 tracking-widest">Charts</h1>
        <Li url="/admin/chart/bar">
          <FaChartBar />
          <span>Bar</span>
        </Li>
        <Li url="/admin/chart/pie">
          <FaChartPie />
          <span>Pie</span>
        </Li>
        <Li url="/admin/chart/line">
          <FaChartLine />
          <span>Line</span>
        </Li>
      </div>

      <div className="p-4">
        <h1 className="uppercase text-gray-600 mb-1 tracking-widest`">Apps</h1>
        <Li url="/admin/app/coupon">
          <RiCoupon3Fill />
          <span>Coupon</span>
        </Li>
      </div>
    </div>
  );
};

const Li = (props) => {
  const { pathname } = useLocation();
  const active = pathname === props.url;
  return (
    <Link
      to={props.url}
      className={`flex gap-2 items-center pl-2 mb-2 rounded-md p-1 cursor-pointer ${
        active ? "bg-blue-300 text-blue-700" : ""
      }`}
    >
      {props.children[0]}
      <span>{props.children[1]}</span>
    </Link>
  );
};

export default Sidebar;
