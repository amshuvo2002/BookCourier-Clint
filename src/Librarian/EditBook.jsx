import { useEffect, useState } from "react";
import { useParams } from "react-router";
import UseAxious from "../Hooks/UseAxious";

export default function EditBook() {
  const { id } = useParams();
  const axiosSecure = UseAxious();
  const [book, setBook] = useState({});

  useEffect(() => {
    axiosSecure.get(`/books/${id}`).then(res => setBook(res.data));
  }, []);

  const handleUpdate = (e) => {
    e.preventDefault();
    axiosSecure.put(`/books/${id}`, book).then(() => alert("Updated"));
  };

  return (
    <form onSubmit={handleUpdate} className="space-y-3">
      <h1 className="text-xl font-bold">Edit Book</h1>

      <input className="input input-bordered w-full"
        value={book.title || ""}
        onChange={(e) => setBook({ ...book, title: e.target.value })}
      />
      <input className="input input-bordered w-full"
        value={book.author || ""}
        onChange={(e) => setBook({ ...book, author: e.target.value })}
      />
      <input className="input input-bordered w-full"
        value={book.price || ""}
        onChange={(e) => setBook({ ...book, price: e.target.value })}
      />
      <input className="input input-bordered w-full"
        value={book.stock || ""}
        onChange={(e) => setBook({ ...book, stock: e.target.value })}
      />

      <button className="btn btn-primary">Save</button>
    </form>
  );
}
