import { useContext } from "react";
import { Authcontext } from "../Context/Authcontext";
import { Navigate } from "react-router";
import UseRole from "../Hooks/Role";


const LibrarianRoute = ({ children }) => {
  const { user, loading } = useContext(Authcontext);
  const [role] = UseRole();

  if (loading) return <p>Loading...</p>;

  if (user && role === "librarian") return children;

  return <Navigate to="/" />;
};

export default LibrarianRoute;
