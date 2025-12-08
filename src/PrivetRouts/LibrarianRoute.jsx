import { useContext } from "react";
import { Authcontext } from "../Context/Authcontext";

export default function LibrarianRoute({ children }) {
  const { user, loading } = useContext(Authcontext);

  if (loading) return <p>Loading...</p>;

  if (user?.role === "librarian") return children;

  return <Navigate to="/unauthorized" />;
}
