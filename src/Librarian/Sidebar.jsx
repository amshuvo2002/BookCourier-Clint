import { useState } from "react";
import { NavLink, Outlet } from "react-router";
import {
  FiBook,
  FiPlusCircle,
  FiClipboard,
  FiSettings,
  FiPackage,
  FiMenu
} from "react-icons/fi";

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const links = [
    { name: "Manage Books", path: "manage-books", icon: <FiBook /> },
    { name: "Add Book", path: "add-book", icon: <FiPlusCircle /> },
    { name: "Book Requests", path: "requests", icon: <FiClipboard /> },
    { name: "Manage Returns", path: "returns", icon: <FiPackage /> },
    { name: "Reports", path: "reports", icon: <FiSettings /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`bg-white border-r shadow-sm transition-all duration-300
        ${sidebarOpen ? "w-64" : "w-20"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-16 border-b">
          {sidebarOpen && (
            <h2 className="text-lg font-bold text-gray-800">
              Librarian Panel
            </h2>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded hover:bg-gray-200 text-gray-700"
          >
            <FiMenu size={20} />
          </button>
        </div>

        {/* Links */}
        <ul className="mt-4 space-y-1 px-2">
          {links.map((link) => (
            <li key={link.name}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition
                  ${
                    isActive
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`
                }
              >
                <span className="text-lg">{link.icon}</span>
                {sidebarOpen && <span>{link.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
