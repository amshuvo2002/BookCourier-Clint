import { useEffect, useState } from "react";
import UseAxious from "../Hooks/UseAxious";


export default function ManageReturns() {
  const axiosSecure = UseAxious();
  const [returns, setReturns] = useState([]);

  useEffect(() => {
    axiosSecure.get("/returns").then(res => setReturns(res.data));
  }, []);

  const handleReceive = (id) => {
    axiosSecure.put(`/returns/${id}`, { status: "received" }).then(() => {
      setReturns(returns.map(r => r._id === id ? { ...r, status: "received" } : r));
    });
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Manage Returns</h1>

      {returns.map(r => (
        <div key={r._id} className="p-4 bg-gray-200 rounded mb-2">
          <p><b>Book:</b> {r.book}</p>
          <p><b>User:</b> {r.user}</p>
          <p><b>Status:</b> {r.status}</p>

          {r.status !== "received" && (
            <button onClick={() => handleReceive(r._id)} className="btn btn-sm">
              Mark as Received
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
