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
        const { data: ordersData } = await axiosSecure.get(`/orders/${user.email}`);

        const ordersWithBookData = await Promise.all(
          ordersData.map(async (o) => {
            let price = o.price ?? null;
            let bookTitle = o.bookTitle ?? o.title ?? null;

            if (!price || !bookTitle) {
              try {
                const bookRes = await axiosSecure.get(`/books/${o.bookId}`);
                price = price ?? bookRes.data.price;
                bookTitle = bookTitle ?? bookRes.data.title;
              } catch (err) {
                console.error("Error fetching book for order", o._id, err);
              }
            }

            return { ...o, price, bookTitle };
          })
        );

        setOrders(ordersWithBookData);
      } catch (err) {
        console.error("Error fetching orders:", err);
        Swal.fire("Error", "Failed to fetch orders!", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, axiosSecure]);

  // Cancel order
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

  // Delete order
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this order permanently?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axiosSecure.delete(`/orders/${id}`);
      setOrders((prev) => prev.filter(o => o._id !== id));
      Swal.fire("Deleted", "Order has been deleted!", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to delete order!", "error");
    }
  };

  const handlePay = async (order) => {
    if (!order._id) {
      Swal.fire("Error", "Order ID missing!", "error");
      return;
    }

    try {
      const { data } = await axiosSecure.get(`/orders/payment/${order._id.toString()}`);
      if (!data) {
        Swal.fire("Error", "Order not found!", "error");
        return;
      }

      navigate(`/dashboard/user/my-orders/payment/${data._id.toString()}`, { state: { order: data } });
    } catch (err) {
      console.error("Payment fetch error:", err.response?.data || err);
      Swal.fire("Error", err.response?.data?.message || "Failed to fetch order!", "error");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading orders...</p>;

  return (
    <div className="text-black px-2 md:px-0">
      <h1 className="text-xl font-bold mb-4">My Orders</h1>

      {/* এই div টা মোবাইলে সুন্দর স্ক্রলবার দেবে */}
      <div className="overflow-x-auto -mx-4 px-4">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full min-w-[700px] border-collapse bg-white">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-3 text-left">Book Name</th>
                <th className="border p-3 text-left">Price</th>
                <th className="border p-3 text-left">Date</th>
                <th className="border p-3 text-center">Cancel</th>
                <th className="border p-3 text-center">Pay Now</th>
                <th className="border p-3 text-center">Delete</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-500">
                    No orders found
                  </td>
                </tr>
              )}
              {orders.map((o) => {
                const isPaid = o.paymentStatus === "paid" || o.status === "paid";
                const isCancelled = o.status === "cancelled";

                const price = o.price ?? "N/A";
                const orderDate = o.orderDate ?? o.createdAt ?? null;
                const bookName = o.bookTitle ?? "N/A";

                return (
                  <tr key={o._id} className="hover:bg-gray-50">
                    <td className="border p-3">{bookName}</td>
                    <td className="border p-3">{price !== "N/A" ? `BDT ${price}` : "N/A"}</td>
                    <td className="border p-3">
                      {orderDate ? new Date(orderDate).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="border p-3 text-center">
                      {!isPaid && !isCancelled && (
                        <button
                          onClick={() => handleCancel(o._id)}
                          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                        >
                          Cancel
                        </button>
                      )}
                      {isCancelled && <span className="text-gray-500">Cancelled</span>}
                    </td>
                    <td className="border p-3 text-center">
                      {!isPaid && !isCancelled && (
                        <button
                          onClick={() => handlePay(o)}
                          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                        >
                          Pay Now
                        </button>
                      )}
                      {isPaid && <span className="text-green-600 font-medium">Paid</span>}
                    </td>
                    <td className="border p-3 text-center">
                      <button
                        onClick={() => handleDelete(o._id)}
                        className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 text-sm"
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
    </div>
  );
}