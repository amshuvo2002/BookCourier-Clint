// src/components/AdminOrders.jsx
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import UseAxious from "../hooks/UseAxious";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const axiosSecure = UseAxious();

  // ---------------- Load all orders ----------------
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get("/orders");
      setOrders(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to load orders", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ---------------- Update Order Status ----------------
  const handleStatusUpdate = async (id, currentStatus) => {
    let nextStatus;
    if (currentStatus === "pending") nextStatus = "shipped";
    else if (currentStatus === "shipped") nextStatus = "delivered";
    else return;

    try {
      const res = await axiosSecure.patch(`/orders/status/${id}`, {
        status: nextStatus,
      });

      if (res.data.modifiedCount > 0) {
        Swal.fire("Success!", `Order status updated to ${nextStatus}`, "success");
        setOrders(prev =>
          prev.map(order =>
            order._id === id ? { ...order, status: nextStatus } : order
          )
        );
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to update order status", "error");
    }
  };

  // ---------------- Cancel Order ----------------
  const handleCancel = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will cancel the order!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Cancel it!",
      cancelButtonText: "No",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await axiosSecure.patch(`/orders/cancel/${id}`);

      if (res.data.modifiedCount > 0) {
        Swal.fire("Cancelled!", "Order cancelled successfully", "success");
        setOrders(prev =>
          prev.map(order =>
            order._id === id ? { ...order, status: "cancelled" } : order
          )
        );
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to cancel order", "error");
    }
  };

  // ---------------- DELETE Order ----------------
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete Order?",
      text: "This order will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "No",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await axiosSecure.delete(`/orders/${id}`);

      if (res.data.deletedCount > 0) {
        Swal.fire("Deleted!", "Order deleted successfully", "success");

        // ❌ UI থেকেও remove
        setOrders(prev => prev.filter(order => order._id !== id));
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to delete order", "error");
    }
  };

  return (
    <div className="md:p-5 p-0 text-black">
      <h2 className="text-2xl font-semibold mb-4">📦 All Orders</h2>

      <div className="overflow-x-auto shadow bg-white text-black rounded">
        <table className="table w-full">
          <thead className="bg-gray-200 text-black">
            <tr>
              <th>#</th>
              <th>Book</th>
              <th>User</th>
              <th>Order Date</th>
              <th>Status</th>
              <th>Payment</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  Loading orders...
                </td>
              </tr>
            )}

            {!loading && orders.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  No orders found
                </td>
              </tr>
            )}

            {!loading &&
              orders.map((order, index) => {
                const {
                  _id,
                  bookTitle = order.bookName,
                  userName = order.userName || order.email,
                  orderDate = order.orderDate || order.createdAt,
                  status,
                  paymentStatus = order.paymentStatus || "unpaid",
                } = order;

                return (
                  <tr key={_id}>
                    <td>{index + 1}</td>
                    <td>{bookTitle}</td>
                    <td>{userName}</td>
                    <td>{new Date(orderDate).toLocaleDateString()}</td>

                    <td>
                      <span
                        className={`px-2 py-1 rounded text-white ${
                          status === "pending"
                            ? "bg-yellow-500"
                            : status === "shipped"
                            ? "bg-blue-600"
                            : status === "delivered"
                            ? "bg-green-600"
                            : "bg-red-600"
                        }`}
                      >
                        {status}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`px-2 py-1 rounded text-white ${
                          paymentStatus === "paid"
                            ? "bg-green-600"
                            : "bg-red-600"
                        }`}
                      >
                        {paymentStatus}
                      </span>
                    </td>

                    <td className="flex gap-2 justify-center">
                      {status !== "delivered" && status !== "cancelled" && (
                        <button
                          onClick={() => handleStatusUpdate(_id, status)}
                          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Next
                        </button>
                      )}

                      {status !== "cancelled" && (
                        <button
                          onClick={() => handleCancel(_id)}
                          className="px-3 py-1 bg-orange-600 text-white rounded hover:bg-orange-700"
                        >
                          Cancel
                        </button>
                      )}

                      {/* DELETE */}
                      <button
                        onClick={() => handleDelete(_id)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
