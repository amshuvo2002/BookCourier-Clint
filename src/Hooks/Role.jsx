import { useContext, useEffect, useState } from "react";
import UseAxious from "./UseAxious";
import { Authcontext } from "../Context/Authcontext";

export default function UseRole() {
  const axiosSecure = UseAxious();
  const { user } = useContext(Authcontext);
  const [role, setRole] = useState(null);

  useEffect(() => {
    if (user?.email) {
      axiosSecure.get(`/users/role/${user.email}`)
        .then(res => setRole(res.data.role))
        .catch(() => setRole(null));
    }
  }, [user]);

  return [role];
}
