import React, { useEffect, useState, useContext } from "react";
import { Link, Outlet, useNavigate } from "react-router";
import { Authcontext } from "../Context/Authcontext";
import UseAxious from "../Hooks/UseAxious";
import {
  FiBook,
  FiUsers,
  FiSettings,
  FiPackage,
  FiPlusCircle,
  FiClipboard,
  FiHome,
} from "react-icons/fi";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const AdminDashboard = () => {
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

  // Redirect non-admin users
  useEffect(() => {
    if (!loading && role !== "admin") {
      navigate("/dashboard/profile", { replace: true });
    }
  }, [loading, role, navigate]);

  if (authLoading || loading) return <p className="p-5 text-center">Loading...</p>;
  if (role !== "admin") return <p className="p-5 text-center text-red-500">Access Denied</p>;

  // Sidebar links
  const adminLinks = [
    { name: "Users", path: "/dashboard/admin/users", icon: <FiUsers size={24} /> },
    { name: "Add Books", path: "/dashboard/admin/add-books", icon: <FiPlusCircle size={24} /> },
    { name: "Books", path: "/dashboard/admin/books", icon: <FiBook size={24} /> },
    { name: "Orders", path: "/dashboard/admin/orders", icon: <FiClipboard size={24} /> },
    { name: "Site Setting", path: "/dashboard/admin/site-setting", icon: <FiSettings size={24} /> },
    { name: "Request Delivery", path: "/dashboard/admin/request-delivery", icon: <FiPackage size={24} /> },
  ];

  return (
    <div className="flex flex-col min-h-screen">
     
      <div className="flex flex-1">
        {/* Sidebar */}
        <div
          className={`bg-gray-100 p-4 transition-all duration-300 ${
            sidebarOpen ? "w-64" : "w-20"
          }`}
        >
          <button
            className="mb-5 p-2 bg-gray-300 rounded"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? "Collapse" : "Expand"}
          </button>

          <ul className="space-y-2">
            {adminLinks.map((link) => (
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
          {/* Dashboard fixed component */}
          <Outlet />
        </div>
      </div>

    
    </div>
  );
};

export default AdminDashboard;
