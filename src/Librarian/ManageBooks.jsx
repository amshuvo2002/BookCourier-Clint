import { useEffect, useState } from "react";
import UseAxious from "../Hooks/UseAxious";
import Swal from "sweetalert2";

export default function MyBooks() {
  const axiosSecure = UseAxious();
  const [books, setBooks] = useState([]);


  useEffect(() => {
    axiosSecure.get("/books").then(res => {
      setBooks(res.data);
    });
  }, []);


  const toggleStatus = async (id, currentStatus) => {
    const newStatus =
      currentStatus === "published" ? "unpublished" : "published";

    const res = await axiosSecure.patch(`/books/status/${id}`, {
      status: newStatus,
    });

    if (res.data.modifiedCount > 0) {
      setBooks(prev =>
        prev.map(book =>
          book._id === id ? { ...book, status: newStatus } : book
        )
      );

      Swal.fire("Success!", `Book ${newStatus}`, "success");
    }
  };


  const handleEdit = (book) => {

    Swal.fire("Edit Clicked", `Edit "${book.title}"`, "info");
  };

  return (
    <div className="bg-white text-black p-6 rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-6">📚 My Books</h1>

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
               
                  <button
                    onClick={() => handleEdit(book)}
                    className="px-3 py-1 text-sm rounded-md bg-blue-100 text-blue-600 hover:bg-blue-200"
                  >
                    Edit
                  </button>

              
                  <button
                    onClick={() => toggleStatus(book._id, book.status)}
                    className={`px-3 py-1 text-sm rounded-md
                      ${
                        book.status === "published"
                          ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                          : "bg-green-100 text-green-700 hover:bg-green-200"
                      }`}
                  >
                    {book.status === "published"
                      ? "Unpublish"
                      : "Publish"}
                  </button>
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
    </div>
  );
}
