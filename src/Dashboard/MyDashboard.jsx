import React, { useEffect, useState, useContext } from "react";
import { Link, Outlet, useNavigate } from "react-router";
import { Authcontext } from "../Context/Authcontext";
import UseAxious from "../Hooks/UseAxious";
import { FiUser, FiShoppingCart, FiFileText, FiCreditCard, FiHome } from "react-icons/fi";

const MyDashboard = () => {
  const { user, loading: authLoading } = useContext(Authcontext);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const axiosSecure = UseAxious();
  const navigate = useNavigate();

  // Fetch role
  useEffect(() => {
    const fetchRole = async () => {
      if (user?.email) {
        try {
          const res = await axiosSecure.get(`/api/getRole?email=${user.email}`);
          setRole(res.data.role);
        } catch (err) {
          console.error("Failed to fetch role:", err);
          setRole(null);
        } finally {
          setLoading(false);
        }
      } else setLoading(false);
    };

    if (!authLoading) fetchRole();
  }, [authLoading, user]);

  // Redirect non-normal users
  useEffect(() => {
    if (!loading && role !== "user") {
      navigate("/dashboard/admin", { replace: true });
    }
  }, [loading, role, navigate]);

  if (authLoading || loading) return <p className="p-5 text-center">Loading...</p>;
  if (role !== "user") return <p className="p-5 text-center text-red-500">Access Denied</p>;

  // User sidebar links
  const userLinks = [
    { name: "Profile", path: "/dashboard/user/profile", icon: <FiUser size={22} /> },
    { name: "My Orders", path: "/dashboard/user/my-orders", icon: <FiShoppingCart size={22} /> },
    { name: "Invoices", path: "/dashboard/user/invoices", icon: <FiFileText size={22} /> },
  ];

  return (
    <div className="flex min-h-screen">

      {/* Sidebar */}
      <div
        className={`bg-gray-100 p-4 transition-all duration-300 shadow-md ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
      >
        <button
          className="mb-5 p-2 bg-gray-300 rounded w-full"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? "Collapse" : "Expand"}
        </button>

        <ul className="space-y-2">
          {userLinks.map((link) => (
            <li key={link.name}>
              <Link
                to={link.path}
                className="flex items-center gap-3 p-2 hover:bg-gray-200 rounded transition"
              >
                {link.icon}
                {sidebarOpen && <span>{link.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-5 bg-gray-50 min-h-screen">
        <Outlet />
      </div>
    </div>
  );
};

export default MyDashboard;
