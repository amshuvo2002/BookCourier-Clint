import React, { useContext, useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import logo from "../assets/vecteezy_delivery-and-courier-motorbike-logo-icon_48113296_New1.jpg";
import { Link } from "react-router";
import { Authcontext } from "../Context/Authcontext";
import useAxiosSecure from "../Hooks/UseAxious";

const Navbar = () => {
  const { user, logout, loading: authLoading } = useContext(Authcontext);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);

  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    const fetchRole = async () => {
      if (!user?.email) {
        setRole("");
        setLoading(false);
        return;
      }

      try {
        const res = await axiosSecure.get(`/api/getRole?email=${user.email}`);
        setRole(res.data.role || "user");
      } catch (err) {
        console.error("Failed to fetch role:", err);
        setRole("user");
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && user?.email) {
      fetchRole();
    } else if (!authLoading && !user?.email) {
      setRole("");
      setLoading(false);
    }
  }, [authLoading, user?.email, axiosSecure]);

  if (authLoading || loading) {
    return (
      <div className="navbar bg-gray-300 text-black shadow-sm">
        <div className="navbar-start p-2">Loading...</div>
      </div>
    );
  }

  // Dashboard link – সবার জন্য default user, admin/librarian override
  let dashboardLink = "/dashboard/user/profile";
  if (role === "admin") {
    dashboardLink = "/dashboard/admin/users";
  } else if (role === "librarian") {
    dashboardLink = "/dashboard/librarian/manage-books";
  }

  const showRequestDeliveryLink = role === "user";

  return (
    <div className="navbar bg-gray-300 text-black shadow-sm">
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

          <ul className="menu menu-sm dropdown-content bg-white rounded-box z-10 mt-3 w-52 p-2 shadow">
            <Link to="/"><li className="hover:underline">Home</li></Link>
            <Link to="/books"><li className="hover:underline">Books</li></Link>

            {showRequestDeliveryLink && (
              <Link to="/request-delivery">
                <li className="hover:underline">Request Delivery</li>
              </Link>
            )}

            {user && dashboardLink && (
              <Link to={dashboardLink}>
                <li className="hover:underline">Dashboard</li>
              </Link>
            )}
          </ul>
        </div>

        <div className="flex items-center gap-5">
          <img className="w-16 h-16 rounded-full" src={logo} alt="BookCourier Logo" />
          <a className="md:text-4xl text-xl font-bold">BookCourier</a>
        </div>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-4">
          <Link to="/"><li className="hover:underline">Home</li></Link>
          <Link to="/books"><li className="hover:underline">Books</li></Link>

          {showRequestDeliveryLink && (
            <Link to="/request-delivery">
              <li className="hover:underline">Request Delivery</li>
            </Link>
          )}

          {user && dashboardLink && (
            <Link to={dashboardLink}>
              <li className="hover:underline">Dashboard</li>
            </Link>
          )}
        </ul>
      </div>

      <div><ThemeToggle /></div>

      <div className="navbar-end">
        {user?.uid ? (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost flex items-center gap-2">
              <img
                src={user.photoURL || "https://i.ibb.co/4pDNDk1/avatar.png"}
                className="w-10 h-10 rounded-full border"
                alt="profile"
              />
              <span className="hidden md:inline font-semibold">
                {user.displayName || "User"}
              </span>
            </div>

            <ul className="menu dropdown-content bg-base-100 rounded-box mt-3 w-52 shadow z-10">
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
          <Link to="/login" className="btn btn-primary">
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;