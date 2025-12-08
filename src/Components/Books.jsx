import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import UseAxious from "../Hooks/UseAxious";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosSecure = UseAxious(); // axios instance

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axiosSecure.get("/books");
        setBooks(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching books:", err);
        setLoading(false);
      }
    };
    fetchBooks();
  }, [axiosSecure]);

  if (loading) return <p className="text-center mt-10">Loading books...</p>;

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold text-center mb-10">Books Collection</h2>
      <div className="grid text-black grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {books.map((book) => (
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
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Books;
