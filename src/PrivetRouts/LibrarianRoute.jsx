import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router";
import { Authcontext } from "../Context/Authcontext";
import axios from "axios";

export default function LibrarianRoute({ children }) {
  const { user, loading: authLoading } = useContext(Authcontext);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      if (user?.email) {
        try {
          const res = await axios.get(`/api/getRole?email=${user.email}`);
          setRole(res.data.role);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      } else setLoading(false);
    };

    if (!authLoading) fetchRole();
  }, [authLoading, user]);

  if (authLoading || loading) return <p>Loading...</p>;

  if (user && role === "librarian") return children;

  return <Navigate to="/" />;
}
