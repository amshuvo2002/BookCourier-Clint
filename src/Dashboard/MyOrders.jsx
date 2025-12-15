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

  useEffect(() => {
    if (!user?.email) return;

    const fetchOrders = async () => {
      try {
        const ordersRes = await axiosSecure.get(`/orders/${user.email}`);
        const ordersData = ordersRes.data;

        const ordersWithPrice = await Promise.all(
          ordersData
            .filter(o => o.status !== "cancelled")
            .map(async (o) => {
              let price = o.price || "N/A";

              if ((!price || price === "N/A") && o.bookId) {
                try {
                  const bookRes = await axiosSecure.get(`/books/${o.bookId}`);
                  price = bookRes.data.price || "N/A";
                } catch (err) {
                  console.error("Book fetch error:", err);
                }
              }

              return { ...o, price };
            })
        );

        setOrders(ordersWithPrice);
      } catch (err) {
        console.error("Error fetching orders:", err);
        Swal.fire("Error", "Failed to fetch orders!", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, axiosSecure]);

  const handleCancel = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to cancel this order permanently?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it!",
      cancelButtonText: "No",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axiosSecure.put(`/orders/${id}/cancel`);
      setOrders((prev) => prev.filter((o) => o._id !== id));
      Swal.fire("Cancelled", "Your order has been cancelled!", "success");
    } catch (error) {
      Swal.fire("Error", "Failed to cancel order!", "error");
    }
  };

  const handlePay = (id) => {
    navigate(`/dashboard/user/my-orders/payment/${id}`);
  };

  if (loading) return <p className="text-center mt-10">Loading orders...</p>;

  return (
    <div className="text-black px-2 md:px-0">
      <h1 className="text-xl font-bold mb-4">My Orders</h1>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border min-w-[600px]">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Book Name</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Cancel</th>
              <th className="border p-2">Pay Now</th>
            </tr>
          </thead>

          <tbody>
            {orders.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-4">
                  No orders found
                </td>
              </tr>
            )}

            {orders.map((o) => {
              const isPaid = o.paymentStatus === "paid" || o.status === "success";

              return (
                <tr key={o._id}>
                  <td className="border p-2">{o.bookTitle || o.bookName || "N/A"}</td>
                  <td className="border p-2">
                    {isPaid ? <span className="text-green-600 font-bold">Paid</span> : `$${o.price}`}
                  </td>
                  <td className="border p-2">
                    {o.orderDate
                      ? new Date(o.orderDate).toLocaleDateString()
                      : o.createdAt
                      ? new Date(o.createdAt).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="border p-2">
                    {!isPaid && (
                      <button
                        onClick={() => handleCancel(o._id)}
                        className="px-3 py-1 bg-red-500 text-white rounded"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                  <td className="border p-2">
                    {!isPaid && (
                      <button
                        onClick={() => handlePay(o._id)}
                        className="px-3 py-1 bg-green-600 text-white rounded"
                      >
                        Pay Now
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Accordion */}
      <div className="md:hidden space-y-4">
        {orders.length === 0 && (
          <p className="text-center py-4">No orders found</p>
        )}

        {orders.map((o) => {
          const isPaid = o.paymentStatus === "paid" || o.status === "success";
          return (
            <div key={o._id} className="border rounded shadow p-3 bg-white">
              <div className="flex justify-between items-center">
                <span className="font-semibold">{o.bookTitle || o.bookName || "N/A"}</span>
                <span className={isPaid ? "text-green-600 font-bold" : "text-gray-800"}>
                  {isPaid ? "Paid" : `$${o.price}`}
                </span>
              </div>

              <div className="mt-2 text-sm text-gray-600">
                <p><strong>Date:</strong> {o.orderDate ? new Date(o.orderDate).toLocaleDateString() : o.createdAt ? new Date(o.createdAt).toLocaleDateString() : "N/A"}</p>
              </div>

              {!isPaid && (
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => handleCancel(o._id)}
                    className="flex-1 px-3 py-1 bg-red-500 text-white rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handlePay(o._id)}
                    className="flex-1 px-3 py-1 bg-green-600 text-white rounded"
                  >
                    Pay Now
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
