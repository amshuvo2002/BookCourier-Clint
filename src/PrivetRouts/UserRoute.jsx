import { useContext } from "react";
import { Authcontext } from "../Context/Authcontext";

export default function UserRoute({ children }) {
  const { user, loading } = useContext(Authcontext);

  if (loading) return <p>Loading...</p>;

  if (user?.role === "user") return children;

  return <Navigate to="/unauthorized" />;
}
