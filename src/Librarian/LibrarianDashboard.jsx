import { Outlet } from "react-router";
import Sidebar from "../Librarian/Sidebar";

export default function LibrarianDashboard() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </div>
  );
}
