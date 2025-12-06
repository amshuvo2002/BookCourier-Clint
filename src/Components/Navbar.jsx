import React from "react";
import ThemeToggle from "./ThemeToggle";
import logo from "../assets/vecteezy_delivery-and-courier-motorbike-logo-icon_48113296_New1.jpg";

const Navbar = () => {
  return (
    <div>
      <div className="navbar bg-gray-300 text-black  shadow-sm">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />{" "}
              </svg>
            </div>
            <ul
              tabIndex="-1"
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                <a>Home</a>
              </li>
              <li>
                <a>Books</a>
              </li>
              <li>
                <a>Request Delivery</a>
              </li>
              <li>
                <a>Dashboard</a>
              </li>
            </ul>
          </div>
          <div className="flex items-center gap-5">
            <img className="w-16 h-16 rounded-full" src={logo} alt="" />
            <a className="text-4xl font-bold">BookCourier</a>
          </div>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <a>Home</a>
            </li>
            <li>
              <a>Books</a>
            </li>
            <li>
              <a>Request Delivery</a>
            </li>
            <li>
              <a>Dashboard</a>
            </li>
          </ul>
        </div>
        <div>
          <ThemeToggle></ThemeToggle>
        </div>
        <div className="navbar-end">
          <a className="btn">Login</a>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
