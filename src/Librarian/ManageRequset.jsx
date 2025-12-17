import React, { useEffect, useState, useContext, useCallback } from "react";
import Swal from "sweetalert2";
import UseAxious from "../Hooks/UseAxious";
import { Authcontext } from "../Context/Authcontext";

const OrdersPage = () => {
  const axiosSecure = UseAxious();
  const { user } = useContext(Authcontext);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);

  const getDisplayStatus = (order) => {
    if (order.paymentStatus !== "paid") return "unpaid";
    return order.orderStatus;
  };

  // ============================
  // Fetch Role
  // ============================
  useEffect(() => {
    if (!user?.email) return;

    const fetchRole = async () => {
      try {
        const res = await axiosSecure.get(`/api/getRole?email=${user.email}`, {
          cache: "no-cache", // Axios v1+ supports this
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        });
        setRole(res.data.role);
      } catch (err) {
        console.error("Error fetching role:", err);
      }
    };

    fetchRole();
  }, [user?.email, axiosSecure]);

  // ============================
  // Fetch Orders - with cache busting
  // ============================
  const fetchOrders = useCallback(async () => {
    if (!user?.email || !role) return;

    try {
      setLoading(true);

      const url =
        role === "librarian" ? "/orders" : `/orders/${user.email}`;

      const res = await axiosSecure.get(url, {
        cache: "no-cache",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
        params: { t: Date.now() }, // Cache buster query param
      });

      setOrders(res.data || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      Swal.fire("Error", "Failed to load orders", "error");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [role, user?.email, axiosSecure]);

  // Fetch when role is ready
  useEffect(() => {
    if (role) {
      fetchOrders();
    }
  }, [role, fetchOrders]);

  // ============================
  // Update Status
  // ============================
  const updateOrderStatus = async (id, newStatus) => {
    try {
      await axiosSecure.patch(`/orders/${id}/status`, { status: newStatus });

      Swal.fire("Success!", `Order status updated to ${newStatus}`, "success");

      // Refetch to get fresh data from server
      fetchOrders();
    } catch (err) {
      console.error("Update failed:", err);
      Swal.fire("Error!", "Could not update order status", "error");
    }
  };

  // Cancel order
  const cancelOrder = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to cancel this order?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it",
    });

    if (!result.isConfirmed) return;

    await updateOrderStatus(id, "cancelled");
  };

  // Next Status
  const nextStatus = (order) => {
    if (order.orderStatus === "pending") {
      updateOrderStatus(order._id, "shipped");
    } else if (order.orderStatus === "shipped") {
      updateOrderStatus(order._id, "delivered");
    }
  };

  // Delete Order
  const deleteOrder = async (id) => {
    const result = await Swal.fire({
      title: "Delete permanently?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
    });

    if (!result.isConfirmed) return;

    try {
      await axiosSecure.delete(`/orders/${id}`);
      Swal.fire("Deleted!", "Order has been removed", "success");
      fetchOrders(); // Refresh list
    } catch (err) {
      console.error(err);
      Swal.fire("Error!", "Could not delete order", "error");
    }
  };

  if (loading) {
    return <p className="text-center mt-10 text-gray-600">Loading orders...</p>;
  }

  return (
    <div className="container mx-auto p-4 text-black">
      <h1 className="text-2xl font-bold mb-6 text-center">📦 Orders</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 text-left">Book</th>
              <th className="py-2 px-4 text-left">User</th>
              <th className="py-2 px-4 text-left">Status</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-500">
                  No orders found
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const status = getDisplayStatus(order);

                return (
                  <tr key={order._id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4">{order.bookTitle}</td>
                    <td className="py-2 px-4">{order.userName || order.userEmail}</td>
                    <td className="py-2 px-4">
                      <span
                        className={`px-3 py-1 rounded text-white text-sm font-medium ${
                          status === "unpaid"
                            ? "bg-gray-500"
                            : status === "pending"
                            ? "bg-yellow-500"
                            : status === "shipped"
                            ? "bg-blue-500"
                            : status === "delivered"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      >
                        {status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-2 px-4 space-x-2">
                      {/* Next Status - Only for librarian & paid orders */}
                      {role === "librarian" &&
                        order.paymentStatus === "paid" &&
                        ["pending", "shipped"].includes(order.orderStatus) && (
                          <button
                            onClick={() => nextStatus(order)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded text-sm transition"
                          >
                            Next Status
                          </button>
                        )}

                      {/* Cancel Button */}
                      {(role === "librarian" || order.userEmail === user?.email) &&
                        order.orderStatus !== "cancelled" &&
                        order.orderStatus !== "delivered" && (
                          <button
                            onClick={() => cancelOrder(order._id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded text-sm transition"
                          >
                            Cancel
                          </button>
                        )}

                      {/* Delete - Only librarian */}
                      {role === "librarian" && (
                        <button
                          onClick={() => deleteOrder(order._id)}
                          className="bg-gray-800 hover:bg-black text-white px-4 py-1.5 rounded text-sm transition"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersPage;