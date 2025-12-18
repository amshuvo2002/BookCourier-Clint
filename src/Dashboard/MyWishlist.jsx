import { useEffect, useState, useContext } from "react";
import { Authcontext } from "../Context/Authcontext";
import UseAxious from "../Hooks/UseAxious";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";

export default function MyWishlist() {
  const axiosSecure = UseAxious();
  const { user } = useContext(Authcontext);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); 

 
  useEffect(() => {
    if (!user) return;
    axiosSecure
      .get(`/wishlist?email=${user.email}`)
      .then(res => {
        setWishlist(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [user]);


  const removeFromWishlist = async (id) => {
    try {
      await axiosSecure.delete(`/wishlist/${id}`);
      setWishlist(prev => prev.filter(b => b._id !== id));
      Swal.fire("Removed!", "Book removed from wishlist", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Error!", "Failed to remove book", "error");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="md:p-4 p-0 text-black">
      <h2 className="text-2xl font-bold mb-6">💛 My Wishlist</h2>

      {wishlist.length === 0 && (
        <p className="text-center text-red-500">No books in wishlist</p>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        {wishlist.map(book => (
          <div key={book._id} className="bg-gray-100 p-4 rounded shadow flex flex-col justify-between">
            <h3 className="font-semibold">{book.title}</h3>
            {book.author && <p className="text-sm text-gray-600">{book.author}</p>}

            <div className="mt-2 flex gap-2">
              <button
                onClick={() => removeFromWishlist(book._id)}
                className="bg-red-500 hover:bg-red-600 text-white rounded px-3 py-1"
              >
                Remove
              </button>

              <button
                onClick={() => navigate(`/books/${book.bookId}`)}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded px-3 py-1"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
