import { Navigate } from "react-router";
import { useContext } from "react";
import { Authcontext } from "../Context/Authcontext";

export default function AdminRoute({ children }) {
  const { user, loading } = useContext(Authcontext);

  if (loading) return <p>Loading...</p>;

  if (user?.role === "admin") return children;

  return <Navigate to="/unauthorized" />;
}
