import { Outlet } from "react-router";
import Sidebar from "../Librarian/Sidebar";

export default function LibrarianDashboard() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="">
      </div>
    </div>
  );
}
