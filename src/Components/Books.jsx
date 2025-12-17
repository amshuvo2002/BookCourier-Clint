import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import UseAxious from "../Hooks/UseAxious";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("asc"); // asc / desc
  const axiosSecure = UseAxious(); // axios instance

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axiosSecure.get("/books");
        // শুধুমাত্র published books রাখছি
        const publishedBooks = res.data.filter(book => book.status === "published");
        setBooks(publishedBooks);
        setFilteredBooks(publishedBooks);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching books:", err);
        setLoading(false);
      }
    };
    fetchBooks();
  }, [axiosSecure]);

  // Search & Sort functionality
  useEffect(() => {
    let tempBooks = [...books];
    if (search) {
      tempBooks = tempBooks.filter((book) =>
        book.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    tempBooks.sort((a, b) => {
      if (sortOrder === "asc") return a.price - b.price;
      else return b.price - a.price;
    });

    setFilteredBooks(tempBooks);
  }, [search, sortOrder, books]);

  if (loading) return <p className="text-center mt-10">Loading books...</p>;

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold text-center mb-6">Books Collection</h2>

      {/* Search & Sort Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <input
          type="text"
          placeholder="Search by book title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full md:w-1/2"
        />

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border p-2 rounded w-full md:w-1/4"
        >
          <option value="asc">Price: Low to High</option>
          <option value="desc">Price: High to Low</option>
        </select>
      </div>

      <div className="grid text-black grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <Link key={book._id} to={`/Books/${book._id}`}>
              <div className="bg-white shadow-lg rounded-lg overflow-hidden hover:scale-105 transform transition duration-300 cursor-pointer">
                <img
                  src={book.img}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold">{book.title}</h3>
                  <p className="text-gray-600">{book.author}</p>
                  <p className="text-gray-800 font-bold mt-2">BDT {book.price}</p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-center col-span-3">No books found</p>
        )}
      </div>
    </div>
  );
};

export default Books;
