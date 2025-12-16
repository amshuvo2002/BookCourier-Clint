import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { Authcontext } from "../Context/Authcontext";
import Swal from "sweetalert2";
import UseAxious from "../Hooks/UseAxious";

const BookDetails = () => {
  const { user } = useContext(Authcontext);
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5); // user rating input
  const [comment, setComment] = useState("");
  const axiosSecure = UseAxious();

  // Fetch book & reviews
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const resBook = await axiosSecure.get(`/books/${id}`);
        setBook(resBook.data);

        const resReviews = await axiosSecure.get(`/reviews/${id}`);
        setReviews(resReviews.data);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching book or reviews:", err);
        setLoading(false);
      }
    };
    fetchBook();
  }, [id, axiosSecure]);

  if (loading) return <p className="text-center py-10">Loading book...</p>;
  if (!book) return <p className="text-center py-10">Book not found!</p>;

  const handlePlaceOrder = async () => {
    if (!user) {
      Swal.fire("Error", "Please login first", "error");
      return;
    }
    if (!phone || !address) {
      Swal.fire("Error", "Please fill all fields", "error");
      return;
    }

    try {
      await axiosSecure.post("/orders", {
        bookId: book._id,
        bookTitle: book.title,
        userId: user.uid,
        userName: user.displayName,
        userEmail: user.email,
        phone,
        address,
        orderStatus: "pending",
        paymentStatus: "unpaid",
        createdAt: new Date(),
      });
      Swal.fire("Success", "Order placed successfully", "success");
      setShowModal(false);
      setPhone("");
      setAddress("");
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  const handleAddReview = async () => {
    if (!user) {
      Swal.fire("Error", "Please login first to add review", "error");
      return;
    }

    try {
      const res = await axiosSecure.post("/reviews", {
        bookId: book._id,
        email: user.email,
        rating,
        comment,
      });

      setReviews(prev => [...prev, res.data]);
      setRating(5);
      setComment("");
      Swal.fire("Success", "Review added!", "success");
    } catch (err) {
      console.error(err);
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to add review",
        "error"
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row gap-10">
        <img
          src={book.img}
          alt={book.title}
          className="w-full md:w-1/2 h-full object-cover rounded-lg"
        />
        <div>
          <h2 className="text-3xl font-bold mb-2">{book.title}</h2>
          <p className="mb-2">Author: {book.author}</p>
          <p className="mb-4">{book.description}</p>
          <p className="text-xl font-semibold mb-6">Price: BDT {book.price}</p>
          <button
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            Order Now
          </button>
          <button
            onClick={async () => {
              if (!user) {
                Swal.fire("Error!", "Please login first", "error");
                return;
              }
              try {
                await axiosSecure.post("/wishlist", {
                  email: user.email,
                  bookId: book._id,
                  title: book.title,
                  img: book.img,
                });
                Swal.fire("Added!", "Book added to your wishlist", "success");
              } catch (err) {
                console.error(err);
                Swal.fire(
                  "Error!",
                  err.response?.data?.message || "Failed to add to wishlist",
                  "error"
                );
              }
            }}
            className="bg-yellow-400 hover:bg-yellow-500 text-white ml-4 px-3 py-1 btn rounded"
          >
            Add to Wishlist
          </button>

          <h1 className="py-5">Go Down For Reviews ⬇️</h1>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-10">
        <h3 className="text-2xl font-bold mb-4">Reviews</h3>

        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((r, i) => (
              <div key={i} className="border p-3 rounded">
                <p className="font-semibold">{r.email}</p>
                <p>Rating: {r.rating} ⭐</p>
                {r.comment && <p>{r.comment}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Add Review Form */}
        <div className="mt-6 border-t pt-4">
          <h4 className="font-semibold mb-2">Add Your Review</h4>
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="input input-bordered w-32 mb-2"
          >
            {[5,4,3,2,1].map(num => (
              <option key={num} value={num}>{num} ⭐</option>
            ))}
          </select>
          <textarea
            placeholder="Write your comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="input input-bordered w-full mb-2"
          />
          <button className="btn btn-primary" onClick={handleAddReview}>
            Submit Review
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 w-2/3 mx-auto bg-opacity-50 flex justify-center items-center z-50">
          <div className="rounded-lg border-2 bg-gray-50 border-black p-6 w-full max-w-md relative">
            <h3 className="text-xl text-black font-bold mb-4">
              Place Your Order
            </h3>
            <input
              type="text"
              value={user?.displayName || ""}
              readOnly
              className="input input-border w-full mb-2"
            />
            <input
              type="email"
              value={user?.email || ""}
              readOnly
              className="input input-bordered w-full mb-2"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="input input-bordered w-full mb-2"
            />
            <textarea
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="input input-bordered w-full mb-2"
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="btn btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handlePlaceOrder}>
                Place Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDetails;
