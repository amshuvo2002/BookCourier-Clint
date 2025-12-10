import { NavLink } from "react-router";

export default function Sidebar() {
  return (
    <div className="p-5 bg-gray-800 min-h-screen text-white">
      <h2 className="text-xl font-bold mb-6">Librarian Panel</h2>

      <ul className="space-y-3">
        <li><NavLink to="manage-books">Manage Books</NavLink></li>
        <li><NavLink to="add-book">Add Book</NavLink></li>
        <li><NavLink to="requests">Book Requests</NavLink></li>
        <li><NavLink to="returns">Manage Returns</NavLink></li>
        <li><NavLink to="reports">Reports</NavLink></li>
      </ul>
    </div>
  );
}
