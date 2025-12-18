import { useState } from "react";

export default function AddBook() {
  const [book, setBook] = useState({
    name: "",
    image: "",
    author: "",
    price: "",
    status: "published",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Book Added:", book); 
  };

  return (
    <div className="text-black">
      <h1 className="text-xl font-bold mb-4">Add Book</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          className="border p-2 w-full rounded"
          placeholder="Book Name"
          onChange={(e) => setBook({...book, name: e.target.value})}
        />

        <input
          className="border p-2 w-full rounded"
          placeholder="Image URL"
          onChange={(e) => setBook({...book, image: e.target.value})}
        />

        <input
          className="border p-2 w-full rounded"
          placeholder="Author Name"
          onChange={(e) => setBook({...book, author: e.target.value})}
        />

        <input
          className="border p-2 w-full rounded"
          placeholder="Price"
          type="number"
          onChange={(e) => setBook({...book, price: e.target.value})}
        />

        <select
          className="border p-2 w-full rounded"
          onChange={(e) => setBook({...book, status: e.target.value})}
        >
          <option value="published">Published</option>
          <option value="unpublished">Unpublished</option>
        </select>

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Book
        </button>
      </form>
    </div>
  );
}
