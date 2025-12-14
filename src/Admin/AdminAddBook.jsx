import { useState } from "react";
import UseAxious from "../Hooks/UseAxious";
import Swal from "sweetalert2";

const AdminAddBook = () => {
  const axiosSecure = UseAxious(); // Custom axios hook
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    author: "",
    img: "", // backend অনুযায়ী 'img'
    status: "published",
    price: "",
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submit
  const handleAddBook = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axiosSecure.post("/books", formData); // Hook ব্যবহার করে POST

      if (res.data.insertedId) {
        Swal.fire({
          title: "Success!",
          text: "Book Added Successfully!",
          icon: "success",
          confirmButtonText: "OK",
        });

        // Reset form
        setFormData({
          name: "",
          author: "",
          img: "",
          status: "published",
          price: "",
        });
      } else {
        Swal.fire("Error", "Failed to add book!", "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire(
        "Error",
        error.response?.data?.message || "Something went wrong!",
        "error"
      );
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
            value={formData.name}
            onChange={handleChange}
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
            value={formData.author}
            onChange={handleChange}
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
            name="img" // backend অনুযায়ী
            value={formData.img}
            onChange={handleChange}
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
            value={formData.status}
            onChange={handleChange}
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
            value={formData.price}
            onChange={handleChange}
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
