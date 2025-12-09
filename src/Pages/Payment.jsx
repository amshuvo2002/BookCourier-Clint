import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import UseAxious from "../Hooks/UseAxious";
import Swal from "sweetalert2";

export default function PaymentPage() {
  const { id } = useParams();
  const axiosSecure = UseAxious();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderRes = await axiosSecure.get(`/orders/id/${id}`);
        let orderData = orderRes.data;

        if (orderData.bookId) {
          const bookRes = await axiosSecure.get(`/books/${orderData.bookId}`);
          orderData = { ...orderData, price: bookRes.data.price };
        }

        setOrder(orderData);
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to fetch order", "error");
      }
    };

    fetchOrder();
  }, [id, axiosSecure]);

  const handlePayment = async () => {
    try {
      const res = await axiosSecure.patch(`/orders/pay/${id}`);
      Swal.fire("Success", `Payment completed!`, "success");
      navigate("/dashboard/my-orders");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Payment failed!", "error");
    }
  };

  if (!order) return <p>Loading order...</p>;

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-200 mt-10 rounded">
      <h2 className="text-xl font-bold mb-4">Payment Page</h2>
      <p><strong>Book:</strong> {order.bookTitle || order.bookName || "N/A"}</p>
      <p><strong>Price:</strong> ${order.price || "N/A"}</p>
      <button
        onClick={handlePayment}
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
      >
        Pay Now
      </button>
    </div>
  );
}
