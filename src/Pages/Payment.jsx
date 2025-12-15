import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import UseAxious from "../Hooks/UseAxious";
import Swal from "sweetalert2";

export default function PaymentPage() {
  const { id } = useParams();
  const axiosSecure = UseAxious();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // ===============================
  // Fetch order details
  // ===============================
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderRes = await axiosSecure.get(`/orders/id/${id}`);
        let orderData = orderRes.data;

        // যদি price না থাকে তাহলে book থেকে আনবে
        if ((!orderData.price || orderData.price === "N/A") && orderData.bookId) {
          const bookRes = await axiosSecure.get(`/books/${orderData.bookId}`);
          orderData = { ...orderData, price: bookRes.data.price };
        }

        setOrder(orderData);
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to fetch order", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, axiosSecure]);

  // ===============================
  // Handle payment with confirmation
  // ===============================
  const handlePayment = async () => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to proceed with the payment?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, pay now!",
      cancelButtonText: "No, cancel",
    });

    if (!confirm.isConfirmed) return; // ইউজার No দিলে return

    try {
      await axiosSecure.patch(`/orders/pay/${id}`);
      Swal.fire("Success", "Payment completed successfully!", "success");
      navigate("/dashboard/user/my-orders");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Payment failed!", "error");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading order...</p>;
  if (!order) return <p className="text-center mt-10">Order not found</p>;

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-200 mt-10 text-black rounded shadow">
      <h2 className="text-xl font-bold mb-4">Payment Page</h2>

      <p className="mb-2">
        <strong>Book:</strong>{" "}
        {order.bookTitle || order.bookName || "N/A"}
      </p>

      <p className="mb-4">
        <strong>Price:</strong> ${order.price || "N/A"}
      </p>

      <button
        onClick={handlePayment}
        className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Pay Now
      </button>
    </div>
  );
}
