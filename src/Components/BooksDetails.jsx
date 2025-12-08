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
  const axiosSecure = UseAxious();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await axiosSecure.get(`/books/${id}`);
        setBook(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching book:", err);
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

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row gap-10">
        <img src={book.img} alt={book.title} className="w-full md:w-1/2 h-full object-cover rounded-lg" />
        <div>
          <h2 className="text-3xl font-bold mb-2">{book.title}</h2>
          <p className="mb-2">Author: {book.author}</p>
          <p className="mb-4">{book.description}</p>
          <p className="text-xl font-semibold mb-6">Price: BDT {book.price}</p>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>Order Now</button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 w-2/3 mx-auto bg-opacity-50 flex justify-center items-center z-50">
          <div className="rounded-lg border-2 bg-gray-50 border-black p-6 w-full max-w-md relative">
            <h3 className="text-xl text-black font-bold mb-4">Place Your Order</h3>
            <input type="text" value={user?.displayName || ""} readOnly className="input input-border w-full mb-2" />
            <input type="email" value={user?.email || ""} readOnly className="input input-bordered w-full mb-2" />
            <input type="tel" placeholder="Phone Number" value={phone} onChange={(e)=>setPhone(e.target.value)} className="input input-bordered w-full mb-2" />
            <textarea placeholder="Address" value={address} onChange={(e)=>setAddress(e.target.value)} className="input input-bordered w-full mb-2" />
            <div className="flex justify-end gap-2 mt-4">
              <button className="btn btn-secondary" onClick={()=>setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handlePlaceOrder}>Place Order</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDetails;
