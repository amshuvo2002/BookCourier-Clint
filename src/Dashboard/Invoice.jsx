import { useEffect, useState, useContext } from "react";
import UseAxious from "../Hooks/UseAxious";
import { Authcontext } from "../Context/Authcontext";
import Swal from "sweetalert2";

export default function Invoices() {
  const axiosSecure = UseAxious();
  const { user } = useContext(Authcontext);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    const fetchInvoices = async () => {
      try {
        const res = await axiosSecure.get(`/orders/${user.email}`);
        const paidOrders = res.data.filter(
          (o) => o.paymentStatus === "paid" || o.status === "success"
        );

        const ordersWithPrice = await Promise.all(
          paidOrders.map(async (o) => {
            if (!o.price && o.bookId) {
              try {
                const bookRes = await axiosSecure.get(`/books/${o.bookId}`);
                return { ...o, price: bookRes.data.price || "N/A" };
              } catch (err) {
                console.error("Error fetching book price:", err);
                return { ...o, price: "N/A" };
              }
            }
            return o;
          })
        );

        setInvoices(ordersWithPrice);
      } catch (err) {
        console.error("Error fetching invoices:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [user, axiosSecure]);

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this invoice permanently?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No",
    });

    if (!confirm.isConfirmed) return;

    try {
      // Backend DELETE request
      await axiosSecure.delete(`/orders/id/${id}`); 

      // Frontend: remove deleted invoice instantly
      setInvoices((prev) => prev.filter((inv) => inv._id === id ? false : true));

      Swal.fire("Deleted!", "Invoice has been deleted.", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to delete invoice", "error");
    }
  };

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
            <th className="border p-2">Action</th>
          </tr>
        </thead>

        <tbody>
          {invoices.length > 0 ? (
            invoices.map((invoice) => (
              <tr key={invoice._id} className="hover:bg-gray-100">
                <td className="border p-2">{invoice.paymentId || "N/A"}</td>
                <td className="border p-2">${invoice.price || "N/A"}</td>
                <td className="border p-2">
                  {invoice.paidAt
                    ? new Date(invoice.paidAt).toLocaleDateString()
                    : invoice.orderDate
                    ? new Date(invoice.orderDate).toLocaleDateString()
                    : invoice.createdAt
                    ? new Date(invoice.createdAt).toLocaleDateString()
                    : "N/A"}
                </td>
                <td className="border p-2">{invoice.bookTitle || "N/A"}</td>
                <td className="border p-2">
                  <button
                    onClick={() => handleDelete(invoice._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center p-4">
                No invoices found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
