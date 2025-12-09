import { useContext, useState } from "react";
import { Authcontext } from "../Context/Authcontext";
import Swal from "sweetalert2";
import UseAxious from "../Hooks/UseAxious";

const RequestDelivery = () => {
    const { user } = useContext(Authcontext);
    const axiosSecure = UseAxious();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const form = e.target;

        const orderData = {
            userId: user?.uid,
            userName: user?.displayName,
            email: user?.email,
            phone: form.phone.value,
            address: form.address.value,
            bookTitle: form.bookName.value,
            price: form.price.value || "N/A", // <-- price field added
            orderDate: new Date(),
            status: "pending",
            paymentStatus: "unpaid",
        };

        try {
            const { data } = await axiosSecure.post("/orders", orderData);

            if (data.insertedId) {
                Swal.fire("Success!", "Your delivery request has been placed!", "success");
                form.reset();
            }
        } catch (error) {
            Swal.fire("Error!", "Something went wrong!", "error");
            console.error(error);
        }

        setLoading(false);
    };

    return (
        <div className="max-w-xl mx-auto p-8 mb-10 text-black bg-white shadow rounded mt-8">
            <h2 className="text-2xl font-semibold mb-6">🚚 Request Delivery</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="font-medium">Book Name</label>
                    <input type="text" name="bookName" required className="w-full p-2 border rounded mt-1" />
                </div>

                <div>
                    <label className="font-medium">Price</label>
                    <input type="number" name="price" required className="w-full p-2 border rounded mt-1" />
                </div>

                <div>
                    <label className="font-medium">Name</label>
                    <input type="text" value={user?.displayName || ""} readOnly className="w-full p-2 border rounded bg-gray-100" />
                </div>

                <div>
                    <label className="font-medium">Email</label>
                    <input type="email" value={user?.email || ""} readOnly className="w-full p-2 border rounded bg-gray-100" />
                </div>

                <div>
                    <label className="font-medium">Phone</label>
                    <input type="text" name="phone" required className="w-full p-2 border rounded mt-1" />
                </div>

                <div>
                    <label className="font-medium">Address</label>
                    <textarea name="address" required className="w-full p-2 border rounded mt-1"></textarea>
                </div>

                <button disabled={loading} className="w-full py-2 bg-blue-600 text-white rounded">
                    {loading ? "Submitting..." : "Place Order"}
                </button>
            </form>
        </div>
    );
};

export default RequestDelivery;
