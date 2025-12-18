import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from "recharts";
import UseAxious from "../Hooks/UseAxious";

export default function OrdersChart() {
  const axiosSecure = UseAxious();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axiosSecure.get("/orders"); 
        const orders = res.data;

     
        const monthlyOrders = {};

        orders.forEach(order => {
          const date = new Date(order.orderDate || order.createdAt);
          const month = date.toLocaleString("default", { month: "short" }); 
        });

       
        const chartData = Object.keys(monthlyOrders).map(month => ({
          name: month,
          orders: monthlyOrders[month],
        }));

        setData(chartData);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [axiosSecure]);

  if (loading) return <p className="p-4 text-center">Loading orders data...</p>;

  return (
    <div className="p-5 shadow rounded-xl border bg-white">
      <h2 className="text-xl font-semibold mb-4">Monthly Orders</h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="orders" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
