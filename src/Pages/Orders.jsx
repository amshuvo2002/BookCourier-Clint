import { useState } from "react";

export default function Orders() {
  const [orders, setOrders] = useState([
    { id: 1, book: "React Guide", user: "Mahmud", status: "pending" },
    { id: 2, book: "JS Basics", user: "Rahim", status: "shipped" },
  ]);

  const nextStatus = (id) => {
    setOrders(orders.map(o => {
      if(o.id === id) {
        const flow = { pending: "shipped", shipped: "delivered", delivered: "delivered" };
        return { ...o, status: flow[o.status] };
      }
      return o;
    }));
  };

  return (
    <div className="text-black">
      <h1 className="text-xl font-bold mb-4">Orders</h1>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Book</th>
            <th className="border p-2">User</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>

        <tbody>
          {orders.map(o => (
            <tr key={o.id}>
              <td className="border p-2">{o.book}</td>
              <td className="border p-2">{o.user}</td>
              <td className="border p-2">{o.status}</td>

              <td className="border p-2">
                {o.status !== "delivered" && (
                  <button
                    onClick={() => nextStatus(o.id)}
                    className="px-3 py-1 bg-green-600 text-white rounded"
                  >
                    Next Status
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
