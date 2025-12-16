import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Authcontext } from "../Context/Authcontext";
import UseAxious from "../Hooks/UseAxious";
import { useNavigate } from "react-router";

export default function MyOrders() {
  const axiosSecure = UseAxious();
  const { user } = useContext(Authcontext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // -------------------------
  // Fetch orders
  // -------------------------
  useEffect(() => {
    if (!user?.email) return;

    const fetchOrders = async () => {
      try {
        const { data: ordersData } = await axiosSecure.get(`/orders/${user.email}`);
        setOrders(ordersData);
      } catch (err) {
        console.error("Error fetching orders:", err);
        Swal.fire("Error", "Failed to fetch orders!", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, axiosSecure]);

  // -------------------------
  // Cancel order
  // -------------------------
  const handleCancel = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to cancel this order?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it!",
      cancelButtonText: "No",
    });

    if (!confirm.isConfirmed) return;

    try {
      const { data } = await axiosSecure.patch(`/orders/${id}/status`, { status: "cancelled" });

      if (data.modifiedCount > 0) {
        setOrders((prev) => prev.map(o => o._id === id ? { ...o, status: "cancelled" } : o));
        Swal.fire("Cancelled", "Your order has been cancelled!", "success");
      } else {
        Swal.fire("Error", "Failed to cancel order!", "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to cancel order!", "error");
    }
  };

  // -------------------------
  // Pay order
  // -------------------------
  const handlePay = async (id) => {
    try {
      const { data } = await axiosSecure.patch(`/orders/${id}/status`, { status: "paid" });

      if (data.modifiedCount > 0) {
        setOrders((prev) => prev.map(o => o._id === id ? { ...o, status: "paid", paymentStatus: "paid" } : o));
        Swal.fire("Success", "Payment completed!", "success");
      } else {
        Swal.fire("Error", "Payment failed!", "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Payment failed!", "error");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading orders...</p>;

  return (
    <div className="text-black px-2 md:px-0">
      <h1 className="text-xl font-bold mb-4">My Orders</h1>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2 text-left">Book Name</th>
              <th className="border p-2 text-left">Price</th>
              <th className="border p-2 text-left">Date</th>
              <th className="border p-2 text-center">Cancel</th>
              <th className="border p-2 text-center">Pay Now</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-4">No orders found</td>
              </tr>
            )}
            {orders.map((o) => {
              const isPaid = o.paymentStatus === "paid" || o.status === "paid";
              const isCancelled = o.status === "cancelled";

              return (
                <tr key={o._id} className="hover:bg-gray-50">
                  <td className="border p-2">{o.bookTitle || "N/A"}</td>
                  <td className="border p-2">{o.price ? `$${o.price}` : "N/A"}</td>
                  <td className="border p-2">{o.orderDate ? new Date(o.orderDate).toLocaleDateString() : "N/A"}</td>
                  <td className="border p-2 text-center">
                    {!isPaid && !isCancelled && (
                      <button
                        onClick={() => handleCancel(o._id)}
                        className="px-3 py-1 bg-red-500 text-white rounded"
                      >
                        Cancel
                      </button>
                    )}
                    {isCancelled && <span className="text-gray-500">Cancelled</span>}
                  </td>
                  <td className="border p-2 text-center">
                    {!isPaid && !isCancelled && (
                      <button
                        onClick={() => handlePay(o._id)}
                        className="px-3 py-1 bg-green-600 text-white rounded"
                      >
                        Pay Now
                      </button>
                    )}
                    {isPaid && <span className="text-green-600">Paid</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
