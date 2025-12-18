import { useContext, useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { Authcontext } from "../Context/Authcontext";
import UseAxious from "../Hooks/UseAxious";

const DashboardLayout = () => {
  const { user, loading: authLoading } = useContext(Authcontext);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const axiosSecure = UseAxious();

  useEffect(() => {
    const fetchRole = async () => {
      if (user?.email) {
        try {
          const res = await axiosSecure.get(`/api/getRole?email=${user.email}`);
          const userRole = res.data.role || "user";
          setRole(userRole);

      
          if (location.pathname === "/dashboard") {
            if (userRole === "admin")
              navigate("/dashboard/admin/users", { replace: true });
            else if (userRole === "librarian")
              navigate("/dashboard/librarian/dashboard", { replace: true });
            else navigate("/dashboard/profile", { replace: true });
          }
        } catch (err) {
          console.error("Failed to fetch role:", err);
          setRole("user"); 
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    if (!authLoading) fetchRole();
  }, [authLoading, user, navigate, location.pathname, axiosSecure]);

  if (authLoading || loading)
    return <p className="md:p-5 p-0 text-center">Loading...</p>;

 
  const sidebarLinks = {
    user: [
      { name: "My Profile", path: "/dashboard/profile" },
      { name: "My Orders", path: "/dashboard/my-orders" },
      { name: "Invoices", path: "/dashboard/invoices" },
      { name: "WishList", path: "/dashboard/my-wishlist" },
    ],
    librarian: [
      { name: "Dashboard", path: "/dashboard/librarian/dashboard" },
      { name: "Manage Books", path: "/dashboard/librarian/manage-books" },
      { name: "Add Book", path: "/dashboard/librarian/add-book" },
      { name: "Requests", path: "/dashboard/librarian/requests" },
      { name: "Returns", path: "/dashboard/librarian/returns" },
      { name: "Reports", path: "/dashboard/librarian/reports" },
    ],
    admin: [
      { name: "Users", path: "/dashboard/admin/users" },
      { name: "Books", path: "/dashboard/admin/books" },
      { name: "Orders", path: "/dashboard/admin/orders" },
      { name: "Add Book", path: "/dashboard/admin/add-books" },
      { name: "Site Setting", path: "/dashboard/admin/site-setting" },
      { name: "Request Delivery", path: "/dashboard/admin/request-delivery" },
    ],
  };

  return (
    <div>
      <Navbar />

      <div className="drawer drawer-mobile">
        <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content md:p-5 p-0">
          <Outlet />
        </div>

        <div className="drawer-side bg-gray-100">
          <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
          <ul className="menu p-4 w-64 space-y-2">
            {(sidebarLinks[role] || []).map((link) => (
              <li key={link.path}>
                <Link to={link.path}>{link.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default DashboardLayout;
