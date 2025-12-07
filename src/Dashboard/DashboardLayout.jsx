import { Outlet, NavLink } from "react-router";
import { useState } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

export default function DashboardLayout() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div>
      <Navbar></Navbar>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div
          className={`bg-gray-900 text-white p-5 transition-all duration-300 
        ${isOpen ? "w-64" : "w-16"}`}
        >
          {/* Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="mb-5 bg-gray-700 px-3 py-1 rounded"
          >
            {isOpen ? "<" : ">"}
          </button>

          <ul className="space-y-3">
            {/* User Links */}
            <hr className="my-3 border-gray-600" />
            <h3 className="text-sm text-gray-400">My Dashboard</h3>
            <li>
              <NavLink to="/dashboard/my-orders">My Orders</NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/profile">My Profile</NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/invoices">Invoices</NavLink>
            </li>

            {/* ⭐ Librarian Links */}
            <hr className="my-3 border-gray-600" />
            <h3 className="text-sm text-gray-400">Librarian Panel</h3>

            <li>
              <NavLink to="/dashboard/add-book">Add Book</NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/my-books">My Books</NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/orders">Orders</NavLink>
            </li>

               {/* ⭐ Admin Links */}
            <hr className="my-3 border-gray-600" />
            <h3 className="text-sm text-gray-400">Admin Panel</h3>

            <li>
              <NavLink to="/dashboard/users">All Users</NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/orders">All Orders</NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/books"> Manage Books</NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/add-book"> Add Books</NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/settings">Settings</NavLink>
            </li>
          </ul>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-1 bg-gray-100 p-6">
          <Outlet />
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}
