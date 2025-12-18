import { useState } from "react";
import UseAxious from "../Hooks/UseAxious";
import Swal from "sweetalert2";

export default function AddBook() {
  const axiosSecure = UseAxious();
  const [info, setInfo] = useState({
    title: "",
    author: "",
    price: "",
    stock: "",
    photoURL: "" 
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axiosSecure.post("/books", info);

      if (res.data.insertedId) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Book added successfully",
          confirmButtonColor: "#2563eb",
        });

       
        setInfo({ title: "", author: "", price: "", stock: "", photoURL: "" });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to add book",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 md:p-4 p-0 text-black">
      <h1 className="text-xl font-bold">Add New Book</h1>

      <input
        className="input input-bordered bg-gray-200 w-full"
        placeholder="Title"
        value={info.title}
        onChange={(e) => setInfo({ ...info, title: e.target.value })}
        required
      />

      <input
        className="input input-bordered bg-gray-200 w-full"
        placeholder="Author"
        value={info.author}
        onChange={(e) => setInfo({ ...info, author: e.target.value })}
        required
      />

      <input
        type="number"
        className="input input-bordered bg-gray-200 w-full"
        placeholder="Price"
        value={info.price}
        onChange={(e) => setInfo({ ...info, price: e.target.value })}
        required
      />

      <input
        type="number"
        className="input input-bordered bg-gray-200 w-full"
        placeholder="Stock"
        value={info.stock}
        onChange={(e) => setInfo({ ...info, stock: e.target.value })}
        required
      />

      <input
        type="text"
        className="input input-bordered bg-gray-200 w-full"
        placeholder="Photo URL"
        value={info.photoURL}
        onChange={(e) => setInfo({ ...info, photoURL: e.target.value })}
      />

      <button className="btn btn-primary w-full">
        Add Book
      </button>
    </form>
  );
}
