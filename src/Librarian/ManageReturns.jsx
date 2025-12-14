import { useEffect, useState } from "react";
import UseAxious from "../Hooks/UseAxious";
import Swal from "sweetalert2";

export default function ManageReturns() {
  const axiosSecure = UseAxious();
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);

  // ---------------------------
  // Load all return requests
  // ---------------------------
  useEffect(() => {
    axiosSecure.get("/returns")
      .then(res => {
        setReturns(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [axiosSecure]);

  // ---------------------------
  // Mark as received
  // ---------------------------
  const handleReceive = async (id) => {
    const confirm = await Swal.fire({
      title: "Mark this return as received?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axiosSecure.put(`/returns/${id}`, { status: "received" });
      setReturns(prev =>
        prev.map(r => r._id === id ? { ...r, status: "received" } : r)
      );

      Swal.fire({
        icon: "success",
        title: "Return marked as received",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update return",
      });
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  if (returns.length === 0)
    return <p className="text-center mt-10 text-red-500">No return requests found</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">📚 Manage Returns</h1>

      <div className="space-y-4">
        {returns.map(r => (
          <div
            key={r._id}
            className="p-4 bg-gray-100 rounded-lg shadow flex flex-col md:flex-row md:justify-between md:items-center"
          >
            <div className="space-y-1">
              <p><b>Book:</b> {r.book || r.bookTitle}</p>
              <p><b>User:</b> {r.user || r.email}</p>
              <p>
                <b>Status:</b>{" "}
                <span
                  className={`font-semibold ${
                    r.status === "received"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  {r.status || "pending"}
                </span>
              </p>
            </div>

            {r.status !== "received" && (
              <button
                onClick={() => handleReceive(r._id)}
                className="btn btn-sm mt-2 md:mt-0 bg-green-100 text-green-700 hover:bg-green-200"
              >
                Mark as Received
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
