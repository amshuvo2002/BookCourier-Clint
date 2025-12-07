import { useState } from "react";
import Swal from "sweetalert2";

const AdminAddBook = () => {
    const [loading, setLoading] = useState(false);

    const handleAddBook = async (e) => {
        e.preventDefault();
        setLoading(true);

        const form = e.target;
        const name = form.name.value;
        const author = form.author.value;
        const image = form.image.value;
        const status = form.status.value;
        const price = form.price.value;

        const newBook = { name, author, image, status, price };

        try {
            const res = await fetch("http://localhost:5000/books", {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify(newBook)
            });

            const data = await res.json();

            if (data.insertedId) {
                Swal.fire({
                    title: "Success!",
                    text: "Book Added Successfully!",
                    icon: "success",
                    confirmButtonText: "OK",
                });
                form.reset();
            }

        } catch (error) {
            Swal.fire("Error", "Something went wrong!", "error");
        }

        setLoading(false);
    };

    return (
        <div className="max-w-xl mx-auto text-black bg-white p-8 shadow rounded">
            <h2 className="text-2xl font-semibold mb-6">➕ Add New Book</h2>

            <form onSubmit={handleAddBook} className="space-y-4">

                {/* Book Name */}
                <div>
                    <label className="font-medium">Book Name</label>
                    <input
                        type="text"
                        name="name"
                        required
                        className="w-full p-2 border rounded mt-1"
                        placeholder="Enter book name"
                    />
                </div>

                {/* Author */}
                <div>
                    <label className="font-medium">Author</label>
                    <input
                        type="text"
                        name="author"
                        required
                        className="w-full p-2 border rounded mt-1"
                        placeholder="Author name"
                    />
                </div>

                {/* Image URL */}
                <div>
                    <label className="font-medium">Image URL</label>
                    <input
                        type="text"
                        name="image"
                        required
                        className="w-full p-2 border rounded mt-1"
                        placeholder="Image URL"
                    />
                </div>

                {/* Status */}
                <div>
                    <label className="font-medium">Status</label>
                    <select
                        name="status"
                        className="w-full p-2 border rounded mt-1"
                    >
                        <option value="published">Published</option>
                        <option value="unpublished">Unpublished</option>
                    </select>
                </div>

                {/* Price */}
                <div>
                    <label className="font-medium">Price (৳)</label>
                    <input
                        type="number"
                        name="price"
                        required
                        className="w-full p-2 border rounded mt-1"
                        placeholder="Price"
                    />
                </div>

                {/* Submit Button */}
                <button
                    disabled={loading}
                    className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    {loading ? "Adding..." : "Add Book"}
                </button>
            </form>
        </div>
    );
};

export default AdminAddBook;
