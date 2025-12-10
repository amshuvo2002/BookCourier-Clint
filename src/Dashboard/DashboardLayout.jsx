import { Outlet, NavLink } from "react-router";
import { useState, useContext } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { Authcontext } from "../Context/Authcontext";
import { FcSalesPerformance } from "react-icons/fc";
import { CgProfile } from "react-icons/cg";
import { BiBookAdd } from "react-icons/bi";
import { MdMenuBook } from "react-icons/md";

export default function DashboardLayout() {
  const [isOpen, setIsOpen] = useState(true);
  const { user } = useContext(Authcontext);

  return (
    <div>
      <Navbar />
      <div className="flex bg-gray-900 min-h-screen">
        {/* Sidebar */}
        <div
          className={`bg-gray-900 text-white h-full p-5 transition-all duration-300 shadow-lg
    ${isOpen ? "w-64" : "w-20"} flex flex-col`}
        >
          {/* Toggle Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="mb-6 bg-gray-800 hover:bg-gray-700 p-2 rounded-lg flex items-center justify-center transition"
          >
            {isOpen ? (
              <span className="text-lg font-bold">&lt;</span>
            ) : (
              <span className="text-lg font-bold">&gt;</span>
            )}
          </button>

          {/* Sidebar Links */}
          <ul className="space-y-4 text-sm font-medium tracking-wide">
            {/* Sales Chart - Admin only */}
            {user?.role === "admin" && (
              <div>
                <h3
                  className={`text-gray-400 mb-1 transition ${
                    isOpen ? "opacity-100" : "opacity-0"
                  }`}
                >
                  Sales Chart
                </h3>
                <li>
                  <NavLink
                    to="/dashboard/monthlySales"
                    className="block hover:bg-gray-800 p-2 rounded-lg"
                  >
                    {isOpen ? "Monthly Sales" : <FcSalesPerformance />}
                  </NavLink>
                </li>
                <hr className="border-gray-700" />
              </div>
            )}

            {/* User Section */}
            <div>
              <h3
                className={`text-gray-400 mb-1 transition ${
                  isOpen ? "opacity-100" : "opacity-0"
                }`}
              >
                My Dashboard
              </h3>

              <li>
                <NavLink
                  to="/dashboard/my-orders"
                  className="block hover:bg-gray-800 p-2 rounded-lg"
                >
                  {isOpen ? "My Orders" : "🛒"}
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/dashboard/profile"
                  className="block hover:bg-gray-800 p-2 rounded-lg"
                >
                  {isOpen ? "My Profile" : <CgProfile />}
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/dashboard/admin/users"
                  className="block hover:bg-gray-800 p-2 rounded-lg"
                >
                  {isOpen ? "Admin User" : <CgProfile />}
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/dashboard/invoices"
                  className="block hover:bg-gray-800 p-2 rounded-lg"
                >
                  {isOpen ? "Invoices" : "📄"}
                </NavLink>
              </li>

              <hr className="border-gray-700" />
            </div>

            {/* Librarian Section */}
            {user?.role === "librarian" && (
              <div>
                <h3
                  className={`text-gray-400 mb-1 transition ${
                    isOpen ? "opacity-100" : "opacity-0"
                  }`}
                >
                  Librarian Panel
                </h3>
                <li>
                  <NavLink
                    to="/dashboard/add-book"
                    className="block hover:bg-gray-800 p-2 rounded-lg"
                  >
                    {isOpen ? "Add Book" : <BiBookAdd />}
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/my-books"
                    className="block hover:bg-gray-800 p-2 rounded-lg"
                  >
                    {isOpen ? "My Books" : <MdMenuBook />}
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/orders"
                    className="block hover:bg-gray-800 p-2 rounded-lg"
                  >
                    {isOpen ? "Orders" : "📦"}
                  </NavLink>
                </li>
                <hr className="border-gray-700" />
              </div>
            )}

            {/* Admin Section */}
            {user?.role === "admin" && (
              <div>
                <h3
                  className={`text-gray-400 mb-1 transition ${
                    isOpen ? "opacity-100" : "opacity-0"
                  }`}
                >
                  Admin Panel
                </h3>
                <li>
                  <NavLink
                    to="/dashboard/users"
                    className="block hover:bg-gray-800 p-2 rounded-lg"
                  >
                    {isOpen ? "All Users" : "👥"}
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/orders"
                    className="block hover:bg-gray-800 p-2 rounded-lg"
                  >
                    {isOpen ? "All Orders" : "🧾"}
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/books"
                    className="block hover:bg-gray-800 p-2 rounded-lg"
                  >
                    {isOpen ? "Manage Books" : "📚"}
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/add-book"
                    className="block hover:bg-gray-800 p-2 rounded-lg"
                  >
                    {isOpen ? "Add Books" : "➕"}
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/settings"
                    className="block hover:bg-gray-800 p-2 rounded-lg"
                  >
                    {isOpen ? "Settings" : "⚙️"}
                  </NavLink>
                </li>
                <hr className="border-gray-700" />
              </div>
            )}
          </ul>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-1 bg-gray-100 p-6">
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
}
