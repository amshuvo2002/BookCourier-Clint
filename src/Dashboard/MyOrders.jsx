import { useState } from "react";

export default function MyOrders() {
  const [orders, setOrders] = useState([
    { id: 1, book: "JS Basics", date: "2025-01-02", status: "pending", paymentStatus: "unpaid" },
    { id: 2, book: "React Pro", date: "2025-01-01", status: "success", paymentStatus: "paid" },
  ]);

  const handleCancel = (id) => {
    setOrders(orders.map(o => 
      o.id === id ? { ...o, status: "cancelled" } : o
    ));
  };

  const handlePay = (id) => {
    setOrders(orders.map(o => 
      o.id === id ? { ...o, status: "success", paymentStatus: "paid" } : o
    ));
  };

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
          {orders.map(o => (
            <tr key={o.id}>
              <td className="border p-2">{o.book}</td>
              <td className="border p-2">{o.date}</td>

              <td className="border p-2">
                {o.status === "pending" && (
                  <button onClick={() => handleCancel(o.id)} className="px-3 py-1 bg-red-500 text-white rounded">
                    Cancel
                  </button>
                )}
              </td>

              <td className="border p-2">
                {o.status === "pending" && o.paymentStatus !== "paid" && (
                  <button onClick={() => handlePay(o.id)} className="px-3 py-1 bg-green-600 text-white rounded">
                    Pay Now
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
