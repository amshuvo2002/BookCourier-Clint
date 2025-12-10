import { useState, useEffect } from "react";
import UseAxious from "../Hooks/UseAxious";


export default function Reports() {
  const axiosSecure = UseAxious();
  const [stats, setStats] = useState({ books: 0, issued: 0, returned: 0 });

  useEffect(() => {
    axiosSecure.get("/reports").then(res => setStats(res.data));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Reports</h1>

      <div className="stats shadow">
        <div className="stat">
          <div className="stat-title">Total Books</div>
          <div className="stat-value">{stats.books}</div>
        </div>

        <div className="stat">
          <div className="stat-title">Issued</div>
          <div className="stat-value">{stats.issued}</div>
        </div>

        <div className="stat">
          <div className="stat-title">Returned</div>
          <div className="stat-value">{stats.returned}</div>
        </div>
      </div>
    </div>
  );
}
