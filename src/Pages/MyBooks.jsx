import { useState } from "react";

export default function MyBooks() {
  const [books, setBooks] = useState([
    { id: 1, name: "React Guide", status: "published", price: 300 },
    { id: 2, name: "Node Mastery", status: "unpublished", price: 450 },
  ]);

  const toggleStatus = (id) => {
    setBooks(books.map(b => 
      b.id === id
        ? { ...b, status: b.status === "published" ? "unpublished" : "published" }
        : b
    ));
  };

  return (
    <div className="text-black">
      <h1 className="text-xl font-bold mb-4">My Books</h1>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>

        <tbody>
          {books.map(b => (
            <tr key={b.id}>
              <td className="border p-2">{b.name}</td>
              <td className="border p-2">{b.status}</td>
              <td className="border p-2">{b.price}</td>

              <td className="border p-2">
                <button 
                  onClick={() => toggleStatus(b.id)}
                  className="px-3 py-1 bg-purple-600 text-white rounded"
                >
                  {b.status === "published" ? "Unpublish" : "Publish"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}
