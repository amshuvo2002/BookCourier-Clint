import React, { useContext, useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import logo from "../assets/vecteezy_delivery-and-courier-motorbike-logo-icon_48113296_New1.jpg";
import { Link } from "react-router";
import { Authcontext } from "../Context/Authcontext";
import axios from "axios";

const Navbar = () => {
  const { user, logout, loading: authLoading } = useContext(Authcontext);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch role
  useEffect(() => {
    const fetchRole = async () => {
      if (user?.email) {
        try {
          const res = await axios.get(
            `http://localhost:3000/api/getRole?email=${user.email}`
          );
          setRole(res.data.role || null);
        } catch (err) {
          console.error("Failed to fetch role:", err);
          setRole(null);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        setRole(null);
      }
    };

    if (!authLoading) fetchRole();
  }, [authLoading, user]);

  if (authLoading || loading) {
    return (
      <div className="navbar bg-gray-300 text-black shadow-sm">
        <div className="navbar-start p-2">Loading...</div>
      </div>
    );
  }

  // Dashboard link by role
  let dashboardLink = "";
  if (role === "admin") dashboardLink = "/dashboard/admin/users";
  else if (role === "librarian") dashboardLink = "/dashboard/librarian/manage-books";
  else if (role === "user") dashboardLink = "/dashboard/user/my-orders";

  return (
    <div className="navbar bg-gray-300 text-black shadow-sm">
      {/* Navbar Start */}
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>

          {/* Mobile Menu */}
          <ul className="menu menu-sm dropdown-content bg-white bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
            <Link to="/"><h1 className="hover:underline">Home</h1></Link>
            <Link to="/books"><h1 className="hover:underline">Books</h1></Link>

            {/* USER ONLY */}
            {role === "user" && (
              <Link to="/request-delivery">
                <h1 className="hover:underline">Request Delivery</h1>
              </Link>
            )}

            {user && dashboardLink && (
              <Link to={dashboardLink}>
                <h1 className="hover:underline">Dashboard</h1>
              </Link>
            )}
          </ul>
        </div>

        <div className="flex items-center gap-5">
          <img className="w-16 h-16 rounded-full" src={logo} alt="" />
          <a className="md:text-4xl text-xl font-bold">BookCourier</a>
        </div>
      </div>

      {/* Navbar Center (Desktop) */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-4">
          <Link to="/"><h1 className="hover:underline">Home</h1></Link>
          <Link to="/books"><h1 className="hover:underline">Books</h1></Link>

          {/* USER ONLY */}
          {role === "user" && (
            <Link to="/request-delivery">
              <h1 className="hover:underline">Request Delivery</h1>
            </Link>
          )}

          {user && dashboardLink && (
            <Link to={dashboardLink}>
              <h1 className="hover:underline">Dashboard</h1>
            </Link>
          )}
        </ul>
      </div>

      {/* Theme */}
      <div><ThemeToggle /></div>

      {/* Navbar End */}
      <div className="navbar-end">
        {user?.uid ? (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} className="btn btn-ghost flex items-center gap-2">
              <img
                src={user.photoURL || "https://i.ibb.co/4pDNDk1/avatar.png"}
                className="w-10 h-10 rounded-full border"
                alt="profile"
              />
              <span className="hidden md:inline font-semibold">
                {user.displayName || "User"}
              </span>
            </div>

            <ul className="menu menu-sm dropdown-content bg-base-100 rounded-box mt-3 w-52 shadow">
              <li>
                <button
                  onClick={logout}
                  className="text-red-500 font-bold w-full text-left"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <a className="btn">
            <Link to="/login">Login</Link>
          </a>
        )}
      </div>
    </div>
  );
};

export default Navbar;
