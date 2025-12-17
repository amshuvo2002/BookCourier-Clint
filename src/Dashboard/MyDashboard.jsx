import React, { useEffect, useState, useContext } from "react";
import { NavLink, Outlet, useNavigate } from "react-router";
import { Authcontext } from "../Context/Authcontext";
import UseAxious from "../Hooks/UseAxious";
import { FiUser, FiShoppingCart, FiFileText, FiMenu, FiLogOut } from "react-icons/fi";
import { FcTodoList } from "react-icons/fc";

const MyDashboard = () => {
  const { user, loading: authLoading, logout } = useContext(Authcontext);
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
    if (!loading && role !== "user") {
      navigate("/dashboard/admin", { replace: true });
    }
  }, [loading, role, navigate]);

  if (authLoading || loading)
    return <p className="p-6 text-center">Loading...</p>;

  if (role !== "user")
    return <p className="p-6 text-center text-red-500">Access Denied</p>;

  const userLinks = [
    { name: "Profile", path: "/dashboard/user/profile", icon: <FiUser /> },
    { name: "Wish-list", path: "/dashboard/user/wish-list", icon: <FcTodoList /> },
    { name: "My Orders", path: "/dashboard/user/my-orders", icon: <FiShoppingCart /> },
    { name: "Invoices", path: "/dashboard/user/invoices", icon: <FiFileText /> },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`bg-white border-r shadow-sm h-screen transition-all duration-300
        ${sidebarOpen ? "w-64" : "w-20"} overflow-y-auto`}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between px-4 h-10 border-b">
          {sidebarOpen && <h2 className="text-lg font-bold text-gray-800">User Dashboard</h2>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded hover:bg-gray-200 text-gray-700"
          >
            <FiMenu size={20} />
          </button>
        </div>

     
        {/* Links */}
        <ul className="mt-4 space-y-1 px-2">
          {userLinks.map((link) => (
            <li key={link.name}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition
                  ${isActive
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}`
                }
              >
                <span className="text-lg">{link.icon}</span>
                {sidebarOpen && <span>{link.name}</span>}
              </NavLink>
            </li>
          ))}

         
        </ul>
      </aside>

      {/* Main content */}
      <main className="flex-1 md:p-6 p-2 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default MyDashboard;
