import { useContext } from "react";
import { Navigate } from "react-router";
import { Authcontext } from "../Context/Authcontext";

export default function PrivateRoute({ children }) {
  const { user, loading } = useContext(Authcontext);

  if (loading) return <p>Loading...</p>;

  if (user) return children;

  return <Navigate to="/login" />;
}
