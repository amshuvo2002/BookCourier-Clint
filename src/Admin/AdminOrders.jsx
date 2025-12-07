import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);

    // Load all orders
    useEffect(() => {
        fetch("http://localhost:5000/orders")
            .then(res => res.json())
            .then(data => setOrders(data));
    }, []);

    // Update Order Status
    const handleStatusUpdate = (id, currentStatus) => {
        let nextStatus;
        if (currentStatus === "pending") nextStatus = "shipped";
        else if (currentStatus === "shipped") nextStatus = "delivered";
        else return;

        fetch(`http://localhost:5000/orders/status/${id}`, {
            method: "PATCH",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ status: nextStatus })
        })
        .then(res => res.json())
        .then(data => {
            if (data.modifiedCount > 0) {
                Swal.fire("Success!", `Order status updated to ${nextStatus}`, "success");
                const updatedOrders = orders.map(order =>
                    order._id === id ? { ...order, status: nextStatus } : order
                );
                setOrders(updatedOrders);
            }
        });
    };

    // Cancel Order
    const handleCancel = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This will cancel the order!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Cancel it!",
            cancelButtonText: "No",
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`http://localhost:5000/orders/cancel/${id}`, { method: "PATCH" })
                    .then(res => res.json())
                    .then(data => {
                        if (data.modifiedCount > 0) {
                            Swal.fire("Cancelled!", "Order cancelled successfully", "success");
                            const updatedOrders = orders.map(order =>
                                order._id === id ? { ...order, status: "cancelled" } : order
                            );
                            setOrders(updatedOrders);
                        }
                    });
            }
        });
    };

    return (
        <div className="p-5 text-black">
            <h2 className="text-2xl font-semibold mb-4">📦 All Orders</h2>

            <div className="overflow-x-auto shadow bg-white text-black rounded">
                <table className="table w-full">
                    <thead className="bg-gray-200">
                        <tr>
                            <th>#</th>
                            <th>Book</th>
                            <th>User</th>
                            <th>Order Date</th>
                            <th>Status</th>
                            <th>Payment Status</th>
                            <th className="text-center">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {orders.map((order, index) => (
                            <tr key={order._id}>
                                <td>{index + 1}</td>
                                <td>{order.bookName}</td>
                                <td>{order.userName}</td>
                                <td>{new Date(order.orderDate).toLocaleDateString()}</td>

                                <td>
                                    <span className={`px-2 py-1 rounded text-white 
                                        ${order.status === "pending" ? "bg-yellow-500" : 
                                          order.status === "shipped" ? "bg-blue-600" :
                                          order.status === "delivered" ? "bg-green-600" :
                                          "bg-red-600"}`}>
                                        {order.status}
                                    </span>
                                </td>

                                <td>
                                    <span className={`px-2 py-1 rounded text-white 
                                        ${order.paymentStatus === "paid" ? "bg-green-600" : "bg-red-600"}`}>
                                        {order.paymentStatus}
                                    </span>
                                </td>

                                <td className="flex gap-2 justify-center">

                                    {order.status !== "delivered" && order.status !== "cancelled" && (
                                        <button
                                            onClick={() => handleStatusUpdate(order._id, order.status)}
                                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                                        >
                                            Next Status
                                        </button>
                                    )}

                                    {order.status !== "cancelled" && (
                                        <button
                                            onClick={() => handleCancel(order._id)}
                                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                                        >
                                            Cancel
                                        </button>
                                    )}

                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>
        </div>
    );
};

export default AdminOrders;
