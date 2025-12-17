import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import UseAxious from "../Hooks/UseAxious";

export default function AdminRequestDelivery() {
  const axiosSecure = UseAxious();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all delivery requests
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
      const res = await axiosSecure.patch(`/delivery-requests/${status}/${id}`);
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
        setRequests(prev => prev.filter(item => item._id !== id));
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to delete delivery request", "error");
    }
  };

  if (loading) return <p className="text-center py-10 font-bold">Loading...</p>;

  return (
    <div className="p-6 text-black">
      <h2 className="text-2xl font-bold mb-5">📦 Admin Delivery Requests</h2>

      {/* Scrollable table */}
      <div className="overflow-x-auto max-h-[500px] overflow-y-auto border rounded">
        <table className="table w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100 text-black sticky top-0">
            <tr>
              <th className="border px-4 py-2">#</th>
              <th className="border px-4 py-2">User</th>
              <th className="border px-4 py-2">Book</th>
              <th className="border px-4 py-2">Address</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2 text-center">Actions</th>
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
              <tr key={r._id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">{r.user || r.userEmail || "Unknown"}</td>
                <td className="border px-4 py-2">{r.book || r.bookName || "Unknown"}</td>
                <td className="border px-4 py-2">{r.address || "No address provided"}</td>
                <td className="border px-4 py-2">
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
                <td className="border px-4 py-2 text-center flex justify-center gap-2">
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
