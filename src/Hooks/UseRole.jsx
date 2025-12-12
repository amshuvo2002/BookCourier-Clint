import { useContext, useEffect, useState } from "react";
import { Authcontext } from "../Context/Authcontext";
import UseAxious from "./UseAxious";

export default function UseRole() {
  const axiosSecure = UseAxious();
  const { user } = useContext(Authcontext);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      if (!user?.email) {
        setLoading(false);
        return;
      }
      try {
        const res = await axiosSecure.get(`/api/getRole?email=${user.email}`);
        setRole(res.data.role);
      } catch (err) {
        console.error("Failed to fetch role:", err);
        setRole(null);
      } finally {
        setLoading(false);
      }
    };
    fetchRole();
  }, [user]);

  return [role, loading];
}
