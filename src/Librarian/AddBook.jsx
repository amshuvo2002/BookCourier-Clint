import { useState } from "react";
import UseAxious from "../Hooks/UseAxious";


export default function AddBook() {
  const axiosSecure = UseAxious();
  const [info, setInfo] = useState({ title: "", author: "", price: "", stock: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    axiosSecure.post("/books", info).then(() => alert("Book Added!"));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <h1 className="text-xl font-bold">Add New Book</h1>

      <input className="input input-bordered w-full" placeholder="Title"
        onChange={(e) => setInfo({ ...info, title: e.target.value })}
      />
      <input className="input input-bordered w-full" placeholder="Author"
        onChange={(e) => setInfo({ ...info, author: e.target.value })}
      />
      <input className="input input-bordered w-full" placeholder="Price"
        onChange={(e) => setInfo({ ...info, price: e.target.value })}
      />
      <input className="input input-bordered w-full" placeholder="Stock"
        onChange={(e) => setInfo({ ...info, stock: e.target.value })}
      />

      <button className="btn btn-primary">Add</button>
    </form>
  );
}
