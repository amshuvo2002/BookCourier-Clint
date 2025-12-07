import React from "react";
import { Link } from "react-router";

const Books = () => {
  const books = [
    { id: 1, title: "The Silent Echo", author: "John Doe", img: "https://i.ibb.co/QHYfJ0f/book1.jpg", description: "A mysterious tale of adventure and suspense.", price: 500 },
    { id: 2, title: "Whispers of Time", author: "Jane Smith", img: "https://i.ibb.co/L8LXxr1/book2.jpg", description: "Explore the secrets of history and time.", price: 600 },
    { id: 3, title: "Winds of Destiny", author: "Emily Johnson", img: "https://i.ibb.co/pWWLM3m/book3.jpg", description: "An epic story of courage and fate.", price: 450 },
  ];

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold text-center mb-10">Books Collection</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {books.map((book) => (
          <Link key={book.id} to={`/Books/${book.id}`}>
            <div className="bg-white shadow-lg rounded-lg overflow-hidden hover:scale-105 transform transition duration-300 cursor-pointer">
              <img src={book.img} alt={book.title} className="w-full h-64 object-cover" />
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
