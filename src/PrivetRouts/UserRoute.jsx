import { useContext } from "react";
import { Authcontext } from "../Context/Authcontext";
import { Navigate } from "react-router";

export default function UserRoute({ children }) {
  const { user, loading } = useContext(Authcontext);

  if (loading) return <p>Loading...</p>;

  if (user?.role === "user") return children;

  return <Navigate to="/unauthorized" />;
}
