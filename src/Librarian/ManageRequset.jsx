import React, { useEffect, useState, useContext } from "react";
import Swal from "sweetalert2";
import UseAxious from "../Hooks/UseAxious";
import { Authcontext } from "../Context/Authcontext";

const OrdersPage = () => {
  const axiosSecure = UseAxious();
  const { user } = useContext(Authcontext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("user");

  // Fetch role
  useEffect(() => {
    if (user?.email) {
      axiosSecure.get(`/api/getRole?email=${user.email}`)
        .then((res) => setRole(res.data.role))
        .catch((err) => console.error(err));
    }
  }, [user]);

  // Fetch orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      let res;
      if (role === "librarian") {
        res = await axiosSecure.get("/orders");
      } else {
        res = await axiosSecure.get(`/orders/${user.email}`);
      }
      setOrders(res.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) fetchOrders();
  }, [user, role]);

  // Cancel order
  const cancelOrder = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to cancel this order!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it!",
    });

    if (result.isConfirmed) {
      try {
        await axiosSecure.patch(`/orders/${id}/status`, { status: "cancelled" });
        Swal.fire("Canceled!", "Order has been cancelled.", "success");
        fetchOrders();
      } catch (error) {
        console.error("Error cancelling order:", error);
      }
    }
  };

  // Update status
  const updateStatus = async (id, currentStatus) => {
    let newStatus;
    if (currentStatus === "pending") newStatus = "shipped";
    else if (currentStatus === "shipped") newStatus = "delivered";
    else return;

    try {
      await axiosSecure.patch(`/orders/${id}/status`, { status: newStatus });
      Swal.fire("Updated!", `Status changed to ${newStatus}`, "success");
      fetchOrders();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // Delete order (only librarian)
  const deleteOrder = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this order permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axiosSecure.delete(`/orders/${id}`);
        Swal.fire("Deleted!", "Order has been deleted.", "success");
        fetchOrders();
      } catch (error) {
        console.error("Error deleting order:", error);
      }
    }
  };

  if (loading) return <p className="text-center text-gray-600">Loading orders...</p>;

  return (
    <div className="container mx-auto p-4 text-black">
      <h1 className="text-2xl font-bold mb-6 text-center">📦 Orders</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 text-left">Book</th>
              <th className="py-2 px-4 text-left">User</th>
              <th className="py-2 px-4 text-left">Order Status</th>
              <th className="py-2 px-4 text-left">Payment Status</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{order.bookTitle || "No Title"}</td>
                <td className="py-2 px-4">{order.userName || order.email || "Unknown User"}</td>
                <td className="py-2 px-4">
                  <span
                    className={`px-2 py-1 rounded text-white ${
                      order.status === "pending"
                        ? "bg-yellow-500"
                        : order.status === "shipped"
                        ? "bg-blue-500"
                        : order.status === "delivered"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="py-2 px-4 capitalize">{order.paymentStatus}</td>
                <td className="py-2 px-4 space-x-2">
                  {role === "librarian" && order.status !== "delivered" && order.status !== "cancelled" && (
                    <button
                      onClick={() => updateStatus(order._id, order.status)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Next Status
                    </button>
                  )}
                  {(role === "librarian" || order.email === user.email) && order.status !== "cancelled" && (
                    <button
                      onClick={() => cancelOrder(order._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Cancel
                    </button>
                  )}
                  {role === "librarian" && (
                    <button
                      onClick={() => deleteOrder(order._id)}
                      className="bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-900"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {orders.length === 0 && (
          <p className="text-center py-6 text-gray-500">
            No orders found
          </p>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
