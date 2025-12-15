import { useState, useEffect } from "react";
import UseAxious from "../Hooks/UseAxious";


export default function Reports() {
  const axiosSecure = UseAxious();
  const [stats, setStats] = useState({ books: 0, issued: 0, returned: 0 });

  useEffect(() => {
    axiosSecure.get("/reports").then(res => setStats(res.data));
  }, []);

  return (
    <div className="grid grid-cols-1">
      <h1 className="text-2xl font-bold mb-4">Reports</h1>

      <div className="stats shadow text-black">
        <div className="stat">
          <div className="stat-title text-black ">Total Books</div>
          <div className="stat-value ">{stats.books}</div>
        </div>

        <div className="stat">
          <div className="stat-title text-black">Issued</div>
          <div className="stat-value">{stats.issued}</div>
        </div>

        <div className="stat">
          <div className="stat-title text-black">Returned</div>
          <div className="stat-value">{stats.returned}</div>
        </div>
      </div>
    </div>
  );
}
