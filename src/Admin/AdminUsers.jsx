import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const AdminUsers = () => {
    const [users, setUsers] = useState([]);

    // Load all users
    useEffect(() => {
        fetch("http://localhost:5000/users")
            .then(res => res.json())
            .then(data => setUsers(data));
    }, []);

    // Change Role Handler
    const handleRoleChange = (id, newRole) => {
        fetch(`http://localhost:5000/users/role/${id}`, {
            method: "PATCH",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ role: newRole })
        })
            .then(res => res.json())
            .then(data => {
                if (data.modifiedCount > 0) {
                    Swal.fire("Success!", `User role changed to ${newRole}`, "success");
                    const updatedUsers = users.map(user =>
                        user._id === id ? { ...user, role: newRole } : user
                    );
                    setUsers(updatedUsers);
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
                        {users.map((user, index) => (
                            <tr key={user._id}>
                                <td>{index + 1}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                    <span className={`px-2 py-1 rounded text-white 
                                        ${user.role === "admin" ? "bg-red-600" :
                                          user.role === "librarian" ? "bg-blue-600" :
                                          "bg-green-600"}`}>
                                        {user.role}
                                    </span>
                                </td>

                                <td className="flex gap-2 justify-center">

                                    {user.role !== "admin" && (
                                        <button
                                            onClick={() => handleRoleChange(user._id, "admin")}
                                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                                        >
                                            Make Admin
                                        </button>
                                    )}

                                    {user.role !== "librarian" && (
                                        <button
                                            onClick={() => handleRoleChange(user._id, "librarian")}
                                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                                        >
                                            Make Librarian
                                        </button>
                                    )}

                                    {user.role !== "user" && (
                                        <button
                                            onClick={() => handleRoleChange(user._id, "user")}
                                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                                        >
                                            Make User
                                        </button>
                                    )}

                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>
        </div>
    );
};

export default AdminUsers;
