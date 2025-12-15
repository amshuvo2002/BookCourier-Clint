// File: AdminRequestDelivery.jsx
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import UseAxious from "../Hooks/UseAxious";

export default function AdminRequestDelivery() {
  const axiosSecure = UseAxious();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await axiosSecure.get("/delivery-requests");
      setRequests(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to load delivery requests", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // ---------------- Update Status ----------------
  const handleUpdateStatus = async (id, status) => {
    const confirmText = status === "approved" ? "approve" : "reject";
    const result = await Swal.fire({
      title: `Are you sure to ${confirmText}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, ${confirmText}`,
    });

    if (!result.isConfirmed) return;

    try {
      const res = await axiosSecure.patch(
        `/delivery-requests/${status}/${id}`
      );

      if (res.data.modifiedCount > 0) {
        Swal.fire(
          status === "approved" ? "Approved!" : "Rejected!",
          `Delivery request ${status}.`,
          status === "approved" ? "success" : "error"
        );

        setRequests(prev =>
          prev.map(item =>
            item._id === id ? { ...item, status } : item
          )
        );
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to update delivery request", "error");
    }
  };

  // ---------------- DELETE Request ----------------
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete Request?",
      text: "This delivery request will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "No",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await axiosSecure.delete(`/delivery-requests/${id}`);

      if (res.data.deletedCount > 0) {
        Swal.fire("Deleted!", "Delivery request deleted successfully", "success");

        // ❌ UI থেকেও remove
        setRequests(prev => prev.filter(item => item._id !== id));
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to delete delivery request", "error");
    }
  };

  if (loading)
    return <p className="text-center py-10 font-bold">Loading...</p>;

  return (
    <div className="p-6 text-black">
      <h2 className="text-2xl font-bold mb-5">📦 Admin Delivery Requests</h2>

      <div className="overflow-x-auto">
        <table className="table w-full border">
          <thead className="bg-gray-100 text-black">
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Book</th>
              <th>Address</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {requests.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-5 font-bold">
                  No Delivery Requests Found.
                </td>
              </tr>
            )}

            {requests.map((r, index) => (
              <tr key={r._id}>
                <td>{index + 1}</td>
                <td>{r.user || r.userEmail || "Unknown"}</td>
                <td>{r.book || r.bookName || "Unknown"}</td>
                <td>{r.address || "No address provided"}</td>

                <td>
                  <span
                    className={`px-2 py-1 rounded text-white ${
                      r.status === "pending"
                        ? "bg-orange-500"
                        : r.status === "approved"
                        ? "bg-green-600"
                        : "bg-red-600"
                    }`}
                  >
                    {r.status}
                  </span>
                </td>

                <td className="text-center flex justify-center gap-2">
                  <button
                    onClick={() => handleUpdateStatus(r._id, "approved")}
                    disabled={r.status !== "pending"}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => handleUpdateStatus(r._id, "rejected")}
                    disabled={r.status !== "pending"}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                  >
                    Reject
                  </button>

                  {/* DELETE */}
                  <button
                    onClick={() => handleDelete(r._id)}
                    className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-black"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
