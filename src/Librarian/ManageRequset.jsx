import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import UseAxious from "../Hooks/UseAxious";

const LibrarianOrders = () => {
  const axiosSecure = UseAxious();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ------------------------
  // Fetch all orders
  // ------------------------
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get("/orders");
      setOrders(res.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ------------------------
  // Cancel order
  // ------------------------
  const cancelOrder = async (_id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to cancel this order!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it!",
    });

    if (result.isConfirmed) {
      try {
        await axiosSecure.patch(`/orders/${_id}/status`, { orderStatus: "cancelled" });
        Swal.fire("Canceled!", "Order has been cancelled.", "success");
        fetchOrders();
      } catch (error) {
        console.error("Error cancelling order:", error);
      }
    }
  };

  // ------------------------
  // Update status
  // ------------------------
  const updateStatus = async (_id, currentStatus) => {
    let newStatus;
    if (currentStatus === "pending") newStatus = "shipped";
    else if (currentStatus === "shipped") newStatus = "delivered";
    else return;

    try {
      await axiosSecure.patch(`/orders/${_id}/status`, { orderStatus: newStatus });
      Swal.fire("Updated!", `Status changed to ${newStatus}`, "success");
      fetchOrders();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  if (loading) return <p className="text-center text-gray-600">Loading orders...</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Librarian Orders</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 text-left">Book Title</th>
              <th className="py-2 px-4 text-left">User</th>
              <th className="py-2 px-4 text-left">Order Status</th>
              <th className="py-2 px-4 text-left">Payment Status</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-b hover:bg-gray-50">
                {/* Book title */}
                <td className="py-2 px-4">{order.bookTitle || "No Title"}</td>
                {/* User name */}
                <td className="py-2 px-4">{order.userName || "Unknown User"}</td>
                {/* Order Status */}
                <td className="py-2 px-4 capitalize">
                  <span
                    className={`px-2 py-1 rounded text-white ${
                      order.orderStatus === "pending"
                        ? "bg-yellow-500"
                        : order.orderStatus === "shipped"
                        ? "bg-blue-500"
                        : order.orderStatus === "delivered"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                </td>
                {/* Payment Status */}
                <td className="py-2 px-4 capitalize">{order.paymentStatus}</td>
                {/* Actions */}
                <td className="py-2 px-4 space-x-2">
                  {order.orderStatus !== "delivered" && order.orderStatus !== "cancelled" && (
                    <button
                      onClick={() => updateStatus(order._id, order.orderStatus)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Next Status
                    </button>
                  )}
                  {order.orderStatus !== "cancelled" && (
                    <button
                      onClick={() => cancelOrder(order._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LibrarianOrders;
