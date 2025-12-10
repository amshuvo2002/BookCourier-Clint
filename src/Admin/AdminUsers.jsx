import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import UseAxious from "../Hooks/UseAxious";

const AdminUsers = () => {
    const axiosSecure = UseAxious();
    const [users, setUsers] = useState([]);

    // -----------------------------
    // Load all users from MongoDB
    // -----------------------------
    const fetchUsers = async () => {
        try {
            const res = await axiosSecure.get("/users");
            setUsers(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // -----------------------------
    // Handle Role Change
    // -----------------------------
    const handleRoleChange = async (email, newRole) => {
        try {
            const res = await axiosSecure.put(`/users/role/${email}`, { role: newRole });
            if (res.data.modifiedCount > 0) {
                Swal.fire("Success!", `User role changed to ${newRole}`, "success");

                // Update local state
                const updatedUsers = users.map(user =>
                    user.email === email ? { ...user, role: newRole } : user
                );
                setUsers(updatedUsers);
            }
        } catch (err) {
            console.error(err);
            Swal.fire("Error!", "Failed to update role", "error");
        }
    };

    // -----------------------------
    // Handle Delete User
    // -----------------------------
    const handleDeleteUser = async (email) => {
        Swal.fire({
            title: `Are you sure you want to delete ${email}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete",
            cancelButtonText: "Cancel",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axiosSecure.delete(`/users/${email}`);
                    if (res.data.deletedCount > 0) {
                        Swal.fire("Deleted!", "User has been deleted.", "success");
                        setUsers(users.filter(user => user.email !== email));
                    }
                } catch (err) {
                    console.error(err);
                    Swal.fire("Error!", "Failed to delete user", "error");
                }
            }
        });
    };

    return (
        <div className="p-5 text-black">
            <h2 className="text-2xl font-semibold mb-4">👥 All Users</h2>

            <div className="overflow-x-auto shadow text-black bg-white rounded">
                <table className="table w-full">
                    <thead className="bg-gray-200">
                        <tr className="text-black">
                            <th>#</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th className="text-center">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.length > 0 ? (
                            users.map((user, index) => (
                                <tr key={user._id}>
                                    <td>{index + 1}</td>
                                    <td>{user.name || "No Name"}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className={`px-2 py-1 rounded text-white 
                                            ${user.role === "admin" ? "bg-red-600" :
                                              user.role === "librarian" ? "bg-blue-600" :
                                              "bg-green-600"}`}>
                                            {user.role || "user"}
                                        </span>
                                    </td>
                                    <td className="flex gap-2 justify-center">
                                        {user.role !== "admin" && (
                                            <button
                                                onClick={() => handleRoleChange(user.email, "admin")}
                                                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                                            >
                                                Make Admin
                                            </button>
                                        )}

                                        {user.role !== "librarian" && (
                                            <button
                                                onClick={() => handleRoleChange(user.email, "librarian")}
                                                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                                            >
                                                Make Librarian
                                            </button>
                                        )}

                                        {user.role !== "user" && (
                                            <button
                                                onClick={() => handleRoleChange(user.email, "user")}
                                                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                                            >
                                                Make User
                                            </button>
                                        )}

                                        {/* Delete User Button */}
                                        <button
                                            onClick={() => handleDeleteUser(user.email)}
                                            className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-800"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center py-5 font-bold">
                                    No Users Found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminUsers;
