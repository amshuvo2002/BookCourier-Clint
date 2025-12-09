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

  // Fetch User Orders
  useEffect(() => {
    if (!user?.email) return;

    const fetchOrders = async () => {
      try {
        const res = await axiosSecure.get(`/orders/${user.email}`);
        setOrders(res.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, axiosSecure]);

  // Cancel Order
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
      await axiosSecure.patch(`/orders/cancel/${id}`);
      setOrders((prev) => prev.filter((o) => o._id !== id)); // remove from UI
      Swal.fire("Cancelled", "Your order has been cancelled!", "success");
    } catch (error) {
      Swal.fire("Error", "Failed to cancel order!", "error");
    }
  };

  // Pay Order
  const handlePay = async (id) => {
    const confirm = await Swal.fire({
      title: "Proceed to Payment?",
      text: "Do you want to pay for this order now?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });

    if (!confirm.isConfirmed) return;

    // Redirect to payment page (replace `/payment/${id}` with your payment route)
    navigate(`/payment/${id}`);
  };

  if (loading) return <p className="text-center mt-10">Loading orders...</p>;

  return (
    <div className="text-black">
      <h1 className="text-xl font-bold mb-4">My Orders</h1>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Book Name</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Cancel</th>
            <th className="border p-2">Pay Now</th>
          </tr>
        </thead>

        <tbody>
          {orders.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center py-4">
                No orders found
              </td>
            </tr>
          )}

          {orders.map((o) => (
            <tr key={o._id}>
              <td className="border p-2">{o.bookTitle || o.bookName || o.book || "N/A"}</td>
              <td className="border p-2">
                {o.orderDate
                  ? new Date(o.orderDate).toLocaleDateString()
                  : o.createdAt
                  ? new Date(o.createdAt).toLocaleDateString()
                  : "N/A"}
              </td>

              {/* Cancel Button */}
              <td className="border p-2">
                {(o.status === "pending" || o.orderStatus === "pending") ? (
                  <button
                    onClick={() => handleCancel(o._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded"
                  >
                    Cancel
                  </button>
                ) : (
                  <span className="text-red-600 font-bold">
                    {o.status || o.orderStatus}
                  </span>
                )}
              </td>

              {/* Pay Now Button */}
              <td className="border p-2">
                {(o.status === "pending" || o.orderStatus === "pending") &&
                o.paymentStatus !== "paid" ? (
                  <button
                    onClick={() => handlePay(o._id)}
                    className="px-3 py-1 bg-green-600 text-white rounded"
                  >
                    Pay Now
                  </button>
                ) : (
                  <span className="text-green-700 font-bold">
                    {o.paymentStatus || "N/A"}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
