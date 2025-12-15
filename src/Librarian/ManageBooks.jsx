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
      const roleRes = await axiosSecure.get(`/api/getRole?email=${user.email}`);
      setRole(roleRes.data.role);

      const bookRes = await axiosSecure.get("/books");
      setBooks(bookRes.data);
    };

    loadData();
  }, [user.email]);

  // ---------------- DELETE (Admin only) ----------------
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This book and all related orders will be deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      confirmButtonText: "Yes, delete it",
    });

    if (!confirm.isConfirmed) return;

    const res = await axiosSecure.delete(`/books/${id}`);

    if (res.data.deletedCount > 0) {
      setBooks(prev => prev.filter(book => book._id !== id));
      Swal.fire("Deleted!", "Book deleted successfully", "success");
    }
  };

  // ---------------- Publish / Unpublish ----------------
  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "published" ? "unpublished" : "published";

    const res = await axiosSecure.patch(`/books/status/${id}`, {
      status: newStatus,
    });

    if (res.data.modifiedCount > 0) {
      setBooks(prev =>
        prev.map(book =>
          book._id === id ? { ...book, status: newStatus } : book
        )
      );
    }
  };

  return (
    <div className="bg-white text-black md:p-6 p-0 rounded-xl shadow-sm">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Manage Books
      </h1>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
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
              <tr
                key={book._id}
                className="border-t hover:bg-gray-50"
              >
                <td className="px-4 py-3">{book.title}</td>
                <td className="px-4 py-3">{book.author}</td>
                <td className="px-4 py-3">৳{book.price}</td>

                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium
                    ${
                      book.status === "published"
                        ? "bg-green-100 text-green-600"
                        : "bg-yellow-100 text-yellow-600"
                    }`}
                  >
                    {book.status}
                  </span>
                </td>

                <td className="px-4 py-3 text-center space-x-2">
                  {/* Publish / Unpublish */}
                  <button
                    onClick={() => toggleStatus(book._id, book.status)}
                    className={`px-3 py-1 text-sm rounded-md transition
                    ${
                      book.status === "published"
                        ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                        : "bg-green-100 text-green-700 hover:bg-green-200"
                    }`}
                  >
                    {book.status === "published" ? "Unpublish" : "Publish"}
                  </button>

                  {/* Delete (Admin only) */}
                  {role === "admin" && (
                    <button
                      onClick={() => handleDelete(book._id)}
                      className="px-3 py-1 text-sm rounded-md
                      bg-red-100 text-red-600 hover:bg-red-200"
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
          <p className="text-center py-6 text-gray-500">
            No books found
          </p>
        )}
      </div>

      {/* Mobile Accordion */}
      <div className="md:hidden space-y-4">
        {books.length === 0 && (
          <p className="text-center py-4 text-gray-500">No books found.</p>
        )}

        {books.map(book => (
          <div key={book._id} className="border rounded shadow p-4 bg-white">
            <div className="flex justify-between items-center">
              <span className="font-semibold">{book.title}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium
                ${
                  book.status === "published"
                    ? "bg-green-100 text-green-600"
                    : "bg-yellow-100 text-yellow-600"
                }`}>
                {book.status}
              </span>
            </div>

            <div className="mt-2 text-sm text-gray-600">
              <p><strong>Author:</strong> {book.author}</p>
              <p><strong>Price:</strong> ৳{book.price}</p>
            </div>

            <div className="mt-3 flex gap-2">
              <button
                onClick={() => toggleStatus(book._id, book.status)}
                className={`flex-1 px-3 py-1 text-sm rounded-md
                ${
                  book.status === "published"
                    ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                    : "bg-green-100 text-green-700 hover:bg-green-200"
                }`}
              >
                {book.status === "published" ? "Unpublish" : "Publish"}
              </button>

              {role === "admin" && (
                <button
                  onClick={() => handleDelete(book._id)}
                  className="flex-1 px-3 py-1 text-sm rounded-md bg-red-100 text-red-600 hover:bg-red-200"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
