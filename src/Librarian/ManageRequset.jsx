import { useEffect, useState } from "react";
import UseAxious from "../Hooks/UseAxious";
import Swal from "sweetalert2";

export default function ManageRequests() {
  const axiosSecure = UseAxious();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // ---------------------------
  // Load all delivery requests
  // ---------------------------
  useEffect(() => {
    axiosSecure.get("/delivery-requests") // <-- backend route fixed
      .then(res => {
        setRequests(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [axiosSecure]);

  // ---------------------------
  // Update status (approve / reject)
  // ---------------------------
  const handleStatus = async (id, status) => {
    const confirm = await Swal.fire({
      title: `Are you sure you want to ${status}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axiosSecure.patch(`/delivery-requests/${status}/${id}`); // approve/reject route
      setRequests(prev =>
        prev.map(r => (r._id === id ? { ...r, status } : r))
      );

      Swal.fire({
        icon: "success",
        title: `Request ${status}`,
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update request",
      });
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">📚 Book Delivery Requests</h1>

      {requests.length === 0 && (
        <p className="text-red-500 text-center">No requests found</p>
      )}

      <div className="space-y-4">
        {requests.map(r => (
          <div
            key={r._id}
            className="p-4 bg-gray-100 rounded-lg shadow flex flex-col md:flex-row md:justify-between md:items-center"
          >
            <div className="space-y-1">
              <p><b>User:</b> {r.user || r.email || "N/A"}</p>
              <p><b>Book:</b> {r.book || r.bookTitle || "N/A"}</p>
              <p>
                <b>Status:</b>{" "}
                <span
                  className={`font-semibold ${
                    r.status === "approved"
                      ? "text-green-600"
                      : r.status === "rejected"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {r.status || "pending"}
                </span>
              </p>
            </div>

            <div className="mt-3 md:mt-0 flex gap-2">
              <button
                disabled={r.status === "approved"}
                onClick={() => handleStatus(r._id, "approved")}
                className={`btn btn-sm px-3 py-1 rounded-md transition
                  ${r.status === "approved"
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-green-100 text-green-700 hover:bg-green-200"}
                `}
              >
                Approve
              </button>

              <button
                disabled={r.status === "rejected"}
                onClick={() => handleStatus(r._id, "rejected")}
                className={`btn btn-sm px-3 py-1 rounded-md transition
                  ${r.status === "rejected"
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-red-100 text-red-700 hover:bg-red-200"}
                `}
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
