import { useEffect, useState } from "react";
import { Link } from "react-router";
import UseAxious from "../Hooks/UseAxious";

export default function ManageBooks() {
  const axiosSecure = UseAxious();
  const [books, setBooks] = useState([]);

  useEffect(() => {
    axiosSecure.get("/books").then(res => setBooks(res.data));
  }, []);

  const handleDelete = (id) => {
    axiosSecure.delete(`/books/${id}`).then(() => {
      setBooks(books.filter(b => b._id !== id));
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Books</h1>

      <table className="table table-zebra">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {books.map(book => (
            <tr key={book._id}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.price}</td>
              <td>{book.stock}</td>

              <td className="space-x-2">
                <Link className="btn btn-sm" to={`/dashboard/librarian/edit-book/${book._id}`}>Edit</Link>
                <button onClick={() => handleDelete(book._id)} className="btn btn-sm bg-red-500 text-white">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}
