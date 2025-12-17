import { useState } from "react";
import { NavLink, Outlet } from "react-router";
import {
  FiBook,
  FiPlusCircle,
  FiClipboard,
  FiMenu
} from "react-icons/fi";

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const links = [
    { name: "Manage My Books", path: "manage-books", icon: <FiBook /> },
    { name: "Add Book", path: "add-book", icon: <FiPlusCircle /> },
    { name: "Book Orders", path: "requests", icon: <FiClipboard /> },
  ];

  return (
    <div className="flex flex-col min-h-screen w-full">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`bg-white border-r shadow-sm transition-all duration-300
            ${sidebarOpen ? "w-64" : "w-20"} h-full overflow-y-auto`}
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
        <main className="flex-1 overflow-auto p-4 bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
