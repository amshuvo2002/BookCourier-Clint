import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import UseAxious from "../Hooks/UseAxious";

export default function AdminRequestDelivery() {
  const axiosSecure = UseAxious();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load delivery requests
  useEffect(() => {
    axiosSecure.get("/delivery-requests").then((res) => {
      setRequests(res.data);
      setLoading(false);
    });
  }, [axiosSecure]);

  // Approve Delivery
  const handleApprove = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to approve this delivery?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, approve",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.patch(`/delivery-requests/approve/${id}`).then((res) => {
          if (res.data.modifiedCount > 0) {
            Swal.fire("Approved!", "Delivery request approved.", "success");
            setRequests((prev) =>
              prev.map((item) =>
                item._id === id ? { ...item, status: "approved" } : item
              )
            );
          }
        });
      }
    });
  };

  // Reject Delivery
  const handleReject = (id) => {
    Swal.fire({
      title: "Reject this request?",
      text: "This delivery request will be rejected!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Reject",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.patch(`/delivery-requests/reject/${id}`).then((res) => {
          if (res.data.modifiedCount > 0) {
            Swal.fire("Rejected!", "Delivery request rejected.", "error");
            setRequests((prev) =>
              prev.map((item) =>
                item._id === id ? { ...item, status: "rejected" } : item
              )
            );
          }
        });
      }
    });
  };

  if (loading) {
    return <p className="text-center py-10 font-bold">Loading...</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-5">📦 Admin Delivery Requests</h2>

      <div className="overflow-x-auto">
        <table className="table w-full border">
          <thead className="bg-gray-100">
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
            {requests.map((r, index) => (
              <tr key={r._id}>
                <td>{index + 1}</td>
                <td>{r.userEmail}</td>
                <td>{r.bookName}</td>
                <td>{r.address}</td>
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

                <td className="text-center">
                  <button
                    onClick={() => handleApprove(r._id)}
                    disabled={r.status !== "pending"}
                    className="btn btn-success btn-sm mr-2"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => handleReject(r._id)}
                    disabled={r.status !== "pending"}
                    className="btn btn-error btn-sm"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}

            {requests.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-5 font-bold">
                  No Delivery Requests Found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
