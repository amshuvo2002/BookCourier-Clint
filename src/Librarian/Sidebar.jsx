import { useState } from "react";
import { NavLink, Outlet } from "react-router";
import { FiBook, FiPlusCircle, FiClipboard, FiUsers, FiSettings, FiPackage } from "react-icons/fi";

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const links = [
    { name: "Manage Books", path: "manage-books", icon: <FiBook size={24} /> },
    { name: "Add Book", path: "add-book", icon: <FiPlusCircle size={24} /> },
    { name: "Book Requests", path: "requests", icon: <FiClipboard size={24} /> },
    { name: "Manage Returns", path: "returns", icon: <FiPackage size={24} /> },
    { name: "Reports", path: "reports", icon: <FiSettings size={24} /> },
  ];

  return (
    <div className="flex flex-1 min-h-screen">
      {/* Sidebar */}
      <div
        className={`bg-gray-800 text-white transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
      >
        <div className="p-4 flex justify-between items-center">
          {sidebarOpen && <h2 className="text-xl font-bold">Librarian Panel</h2>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 bg-gray-700 rounded"
          >
            {sidebarOpen ? "◀" : "▶"}
          </button>
        </div>

        <ul className="mt-6 space-y-2">
          {links.map((link) => (
            <li key={link.name}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-2 rounded hover:bg-gray-700 transition ${
                    isActive ? "bg-gray-600" : ""
                  }`
                }
              >
                {link.icon}
                {sidebarOpen && <span>{link.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-5 bg-gray-50 min-h-screen">
        <Outlet />
      </div>
    </div>
  );
}
