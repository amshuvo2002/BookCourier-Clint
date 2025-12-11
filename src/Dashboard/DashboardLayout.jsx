import { useContext, useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router";
import Navbar from "../Components/Navbar";
import { Authcontext } from "../Context/Authcontext";
import axios from "axios";

const DashboardLayout = () => {
  const { user, loading: authLoading } = useContext(Authcontext);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch role from backend
  useEffect(() => {
    const fetchRole = async () => {
      if (user?.email) {
        try {
          const res = await axios.get(`http://localhost:3000/api/getRole?email=${user.email}`);
          const userRole = res.data.role;
          setRole(userRole);

          // Auto redirect based on role if at /dashboard
          if (window.location.pathname === "/dashboard") {
            if (userRole === "admin") navigate("/dashboard/admin/users", { replace: true });
            else if (userRole === "librarian") navigate("/dashboard/librarian/dashboard", { replace: true });
            else navigate("/dashboard/profile", { replace: true });
          }
        } catch (err) {
          console.error("Failed to fetch role:", err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    if (!authLoading) fetchRole();
  }, [authLoading, user, navigate]);

  if (authLoading || loading) return <p className="p-5 text-center">Loading...</p>;

  return (
    <div>
      <Navbar />

      <div className="drawer drawer-mobile">
        <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content p-5">
          <Outlet />
        </div>

        <div className="drawer-side bg-gray-100">
          <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
          <ul className="menu p-4 w-64 space-y-2">
            <li>
              <Link to="/dashboard/profile">My Profile</Link>
            </li>
            {role === "user" && (
              <>
                <li><Link to="/dashboard/my-orders">My Orders</Link></li>
                <li><Link to="/dashboard/invoices">Invoices</Link></li>
              </>
            )}
            {role === "librarian" && (
              <>
                <li><Link to="/dashboard/librarian/dashboard">Dashboard</Link></li>
                <li><Link to="/dashboard/librarian/manage-books">Manage Books</Link></li>
                <li><Link to="/dashboard/librarian/add-book">Add Book</Link></li>
                <li><Link to="/dashboard/librarian/requests">Requests</Link></li>
                <li><Link to="/dashboard/librarian/returns">Returns</Link></li>
                <li><Link to="/dashboard/librarian/reports">Reports</Link></li>
              </>
            )}
            {role === "admin" && (
              <>
                <li><Link to="/dashboard/admin/users">Users</Link></li>
                <li><Link to="/dashboard/admin/books">Books</Link></li>
                <li><Link to="/dashboard/admin/orders">Orders</Link></li>
                <li><Link to="/dashboard/admin/add-books">Add Book</Link></li>
                <li><Link to="/dashboard/admin/site-setting">Site Setting</Link></li>
                <li><Link to="/dashboard/admin/request-delivery">Request Delivery</Link></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
