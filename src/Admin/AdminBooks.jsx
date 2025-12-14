import { useEffect, useState, useContext } from "react";
import UseAxious from "../Hooks/UseAxious";
import Swal from "sweetalert2";
import { Authcontext } from "../Context/Authcontext";

export default function ManageBooks() {
  const axiosSecure = UseAxious();
  const { user } = useContext(Authcontext);

  const [books, setBooks] = useState([]);
  const [role, setRole] = useState("");

  // Load role + books
  useEffect(() => {
    const loadData = async () => {
      try {
        const roleRes = await axiosSecure.get(`/api/getRole?email=${user.email}`);
        setRole(roleRes.data.role);

        const bookRes = await axiosSecure.get("/books");
        setBooks(bookRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    loadData();
  }, [user.email]);

  // ---------------- DELETE ----------------
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This book will be deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      confirmButtonText: "Yes, delete it",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await axiosSecure.delete(`/books/${id}`);
      if (res.data.deletedCount > 0) {
        setBooks(prev => prev.filter(book => book._id !== id));
        Swal.fire("Deleted!", "Book deleted successfully", "success");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to delete book", "error");
    }
  };

  // ---------------- Publish / Unpublish ----------------
  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "published" ? "unpublished" : "published";

    try {
      const res = await axiosSecure.put(`/books/status/${id}`, { status: newStatus });
      if (res.data.modifiedCount > 0) {
        setBooks(prev =>
          prev.map(book =>
            book._id === id ? { ...book, status: newStatus } : book
          )
        );
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to update status", "error");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl text-black shadow-sm">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Manage Books</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr className="text-sm text-gray-700">
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Author</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {books.map(book => (
              <tr key={book._id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">{book.name || book.title}</td>
                <td className="px-4 py-3">{book.author}</td>
                <td className="px-4 py-3">৳{book.price}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium
                    ${book.status === "published"
                      ? "bg-green-100 text-green-600"
                      : "bg-yellow-100 text-yellow-600"}`}
                  >
                    {book.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-center space-x-2">
                  <button
                    onClick={() => toggleStatus(book._id, book.status)}
                    className={`px-3 py-1 text-sm rounded-md transition
                    ${book.status === "published"
                      ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                      : "bg-green-100 text-green-700 hover:bg-green-200"}`}
                  >
                    {book.status === "published" ? "Unpublish" : "Publish"}
                  </button>

                  {role === "admin" && (
                    <button
                      onClick={() => handleDelete(book._id)}
                      className="px-3 py-1 text-sm rounded-md bg-red-100 text-red-600 hover:bg-red-200"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {books.length === 0 && (
          <p className="text-center py-6 text-gray-500">No books found</p>
        )}
      </div>
    </div>
  );
}
