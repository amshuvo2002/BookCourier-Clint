// PrivateRoute.jsx
import { useContext } from "react";
import { Navigate, useLocation } from "react-router";
import { Authcontext } from "../Context/Authcontext";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(Authcontext);
  const location = useLocation();

  if (loading) {
    return <p className="text-center py-20">Loading...</p>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
