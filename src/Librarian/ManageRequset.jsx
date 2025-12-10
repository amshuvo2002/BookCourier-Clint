import { useEffect, useState } from "react";
import UseAxious from "../Hooks/UseAxious";


export default function ManageRequests() {
  const axiosSecure = UseAxious();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    axiosSecure.get("/requests").then(res => setRequests(res.data));
  }, []);

  const handleStatus = (id, status) => {
    axiosSecure.put(`/requests/${id}`, { status }).then(() => {
      setRequests(requests.map(r => r._id === id ? { ...r, status } : r));
    });
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Book Requests</h1>

      {requests.map(r => (
        <div key={r._id} className="p-4 bg-gray-200 mb-2 rounded">
          <p><b>User:</b> {r.user}</p>
          <p><b>Book:</b> {r.book}</p>
          <p><b>Status:</b> {r.status}</p>

          <button onClick={() => handleStatus(r._id, "approved")} className="btn btn-sm mr-2">
            Approve
          </button>
          <button onClick={() => handleStatus(r._id, "rejected")} className="btn btn-sm bg-red-500 text-white">
            Reject
          </button>
        </div>
      ))}
    </div>
  );
}
