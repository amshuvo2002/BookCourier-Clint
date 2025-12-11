import { useContext, useEffect, useState } from "react";
import { Authcontext } from "../Context/Authcontext";
import UseAxious from "./UseAxious";

export default function UseRole() {
  const axiosSecure = UseAxious();
  const { user } = useContext(Authcontext);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      axiosSecure.get(`/userRole/${user.email}`).then(res => {
        setRole(res.data.role);
        setLoading(false);
      });
    }
  }, [user]);

  return [role, loading];
}
