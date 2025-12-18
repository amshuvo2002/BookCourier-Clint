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


  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await axiosSecure.get(
          `/orders/payment/${id}`
        );

       
        if ((!data.price || data.price === "N/A") && data.bookId) {
          const bookRes = await axiosSecure.get(
            `/books/${data.bookId}`
          );
          data.price = bookRes.data.price;
        }

        setOrder(data);
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to load order", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, axiosSecure]);


  const handlePayment = async () => {
    const confirm = await Swal.fire({
      title: "Confirm Payment?",
      text: "Do you want to proceed with payment?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Pay",
    });

    if (!confirm.isConfirmed) return;

    try {
      const { data } = await axiosSecure.patch(
        `/orders/${id}/payment`,
        {
          paymentStatus: "paid",
        }
      );

      if (data.modifiedCount > 0) {
        Swal.fire(
          "Success",
          "Payment completed successfully!",
          "success"
        );
        navigate("/dashboard/user/my-orders");
      } else {
        Swal.fire("Error", "Payment update failed!", "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Payment failed!", "error");
    }
  };

  if (loading)
    return (
      <p className="text-center mt-10">Loading order...</p>
    );

  if (!order)
    return (
      <p className="text-center mt-10">Order not found</p>
    );

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-200 mt-10 text-black rounded shadow">
      <h2 className="text-xl font-bold mb-4">
        Payment Page
      </h2>

      <p className="mb-2">
        <strong>Book:</strong>{" "}
        {order.bookTitle || "N/A"}
      </p>

      <p className="mb-4">
        <strong>Price:</strong>{" "}
        {order.price
          ? `BDT ${order.price.toLocaleString()}`
          : "N/A"}
      </p>

      {order.paymentStatus === "paid" ? (
        <p className="text-green-600 font-semibold">
          ✔ Payment Completed
        </p>
      ) : (
        <button
          onClick={handlePayment}
          className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Pay Now
        </button>
      )}
    </div>
  );
}
