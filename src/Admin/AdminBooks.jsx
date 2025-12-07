import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const AdminBooks = () => {
    const [books, setBooks] = useState([]);

    // Load all books
    useEffect(() => {
        fetch("http://localhost:5000/books")
            .then(res => res.json())
            .then(data => setBooks(data));
    }, []);

    // Publish / Unpublish Handler
    const handleStatusToggle = (id, currentStatus) => {
        const newStatus = currentStatus === "published" ? "unpublished" : "published";

        fetch(`http://localhost:5000/books/status/${id}`, {
            method: "PATCH",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ status: newStatus })
        })
            .then(res => res.json())
            .then(data => {
                if (data.modifiedCount > 0) {
                    Swal.fire("Success!", `Book ${newStatus}`, "success");

                    const updated = books.map(book =>
                        book._id === id ? { ...book, status: newStatus } : book
                    );
                    setBooks(updated);
                }
            });
    };

    // Delete Book + Orders
    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This will delete the book + all related orders!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Delete",
            cancelButtonText: "Cancel",
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`http://localhost:5000/books/${id}`, {
                    method: "DELETE"
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.deletedBook) {
                            Swal.fire("Deleted!", "Book deleted successfully", "success");
                            setBooks(books.filter(b => b._id !== id));
                        }
                    });
            }
        });
    };


    return (
        <div className="p-5 text-black">
            <h2 className="text-2xl font-semibold mb-4">📚 Manage Books</h2>

            <div className="overflow-x-auto shadow text-black bg-white rounded">
                <table className="table w-full">
                    <thead className="bg-gray-200">
                        <tr className="text-black">
                            <th>#</th>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Author</th>
                            <th>Status</th>
                            <th>Price</th>
                            <th className="text-center">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {books.map((book, index) => (
                            <tr key={book._id}>
                                <td>{index + 1}</td>

                                <td>
                                    <img
                                        src={book.image}
                                        alt=""
                                        className="w-16 h-20 object-cover rounded"
                                    />
                                </td>

                                <td>{book.name}</td>
                                <td>{book.author}</td>

                                <td>
                                    <span className={`px-2 py-1 rounded text-white 
                                        ${book.status === "published" ? "bg-green-600" : "bg-gray-500"}`}
                                    >
                                        {book.status}
                                    </span>
                                </td>

                                <td>৳ {book.price}</td>

                                <td className="flex gap-2 justify-center">

                                    {/* Toggle Publish */}
                                    <button
                                        onClick={() => handleStatusToggle(book._id, book.status)}
                                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                                    >
                                        {book.status === "published" ? "Unpublish" : "Publish"}
                                    </button>

                                    {/* Delete */}
                                    <button
                                        onClick={() => handleDelete(book._id)}
                                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                                    >
                                        Delete
                                    </button>

                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>
        </div>
    );
};

export default AdminBooks;
