import React, { useEffect, useState, useContext } from "react";
import { NavLink, Outlet, useNavigate } from "react-router";
import { Authcontext } from "../Context/Authcontext";
import UseAxious from "../Hooks/UseAxious";
import {
  FiBook,
  FiUsers,
  FiSettings,
  FiPackage,
  FiPlusCircle,
  FiClipboard,
  FiMenu,
} from "react-icons/fi";

const AdminDashboard = () => {
  const { user, loading: authLoading } = useContext(Authcontext);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const axiosSecure = UseAxious();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRole = async () => {
      if (user?.email) {
        try {
          const res = await axiosSecure.get(`/api/getRole?email=${user.email}`);
          setRole(res.data.role);
        } catch {
          setRole(null);
        } finally {
          setLoading(false);
        }
      } else setLoading(false);
    };
    if (!authLoading) fetchRole();
  }, [authLoading, user]);

  useEffect(() => {
    if (!loading && role !== "admin") {
      navigate("/dashboard/profile", { replace: true });
    }
  }, [loading, role, navigate]);

  if (authLoading || loading)
    return <p className="p-6 text-center">Loading...</p>;

  if (role !== "admin")
    return <p className="p-6 text-center text-red-500">Access Denied</p>;

  const adminLinks = [
    { name: "Users", path: "/dashboard/admin/users", icon: <FiUsers /> },
    { name: "Add Books", path: "/dashboard/admin/add-books", icon: <FiPlusCircle /> },
    { name: "Books", path: "/dashboard/admin/books", icon: <FiBook /> },
    { name: "Orders", path: "/dashboard/admin/orders", icon: <FiClipboard /> },
    { name: "Request Delivery", path: "/dashboard/admin/request-delivery", icon: <FiPackage /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`bg-white border-r shadow-sm transition-all duration-300
        ${sidebarOpen ? "w-64" : "w-20"}`}
      >
        <div className="flex items-center justify-between px-4 h-16 border-b">
          {sidebarOpen && (
            <h2 className="text-lg font-bold text-gray-800">
              Admin Dashboard
            </h2>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded hover:bg-gray-200 text-gray-700"
          >
            <FiMenu size={20} />
          </button>
        </div>

        <ul className="mt-4 space-y-1 px-2">
          {adminLinks.map((link) => (
            <li key={link.name}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition
                  ${
                    isActive
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`
                }
              >
                <span className="text-lg">{link.icon}</span>
                {sidebarOpen && <span>{link.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;
