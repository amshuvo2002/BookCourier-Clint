import React, { useEffect, useState, useContext } from "react";
import UseAxious from "../Hooks/UseAxious";
import { Authcontext } from "../Context/Authcontext";

export default function Invoices() {
  const axiosSecure = UseAxious(); // custom axios instance
  const { user } = useContext(Authcontext); // logged-in user
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return; // user না থাকলে fetch করবে না

    const fetchInvoices = async () => {
      try {
        const res = await axiosSecure.get(`/invoices/${user.email}`);
        setInvoices(res.data);
      } catch (err) {
        console.error("Error fetching invoices:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [user, axiosSecure]);

  if (loading) return <p className="text-center mt-10">Loading invoices...</p>;

  return (
    <div className="text-black max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Invoices</h1>

      <table className="w-full border text-left">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Payment ID</th>
            <th className="border p-2">Amount</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Book Name</th>
          </tr>
        </thead>

        <tbody>
          {invoices.length > 0 ? (
            invoices.map((invoice) => (
              <tr key={invoice._id} className="hover:bg-gray-100">
                <td className="border p-2">{invoice.paymentId || "N/A"}</td>
                <td className="border p-2">{invoice.amount || "N/A"}</td>
                <td className="border p-2">
                  {invoice.orderDate || invoice.createdAt
                    ? new Date(invoice.orderDate || invoice.createdAt).toLocaleDateString()
                    : "N/A"}
                </td>
                <td className="border p-2">
                  {invoice.bookName || invoice.bookTitle || "N/A"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center p-4">
                No invoices found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
