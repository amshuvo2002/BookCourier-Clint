import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router";

// Layouts
import MainLayout from "./MainLayout/MainLayout.jsx";
import DashboardLayout from "./Dashboard/DashboardLayout.jsx";

// Pages
import Home from "./Components/Home.jsx";
import Books from "./Components/Books.jsx";
import RequestDelivery from "./Components/RequestDelivery.jsx";
import Login from "./Components/Login.jsx";
import Register from "./Components/Register.jsx";
import Error from "./Components/Error.jsx";
import BookDetails from "./Components/BooksDetails.jsx";

// Dashboard Pages (User)
import MyProfile from "./Dashboard/MyProfile.jsx";
import MyOrders from "./Dashboard/MyOrders.jsx";
import Invoices from "./Dashboard/Invoice.jsx";
import SalesChart from "./Pages/SalesChart.jsx";
import PaymentPage from "./Pages/Payment.jsx";
import UserDashboard from "./Dashboard/UserDashboard.jsx";

// Librarian Pages
import LibrarianDashboard from "./Librarian/LibrarianDashboard.jsx";
import ManageBooks from "./Librarian/ManageBooks.jsx";
import AddBook from "./Librarian/AddBook.jsx";
import EditBook from "./Librarian/EditBook.jsx";
import ManageRequests from "./Librarian/ManageRequset.jsx";
import ManageReturns from "./Librarian/ManageReturns.jsx";
import Reports from "./Librarian/Reports.jsx";

// Admin Pages
import AdminDashboard from "./Admin/AdminDashborard.jsx";
import AdminAddBook from "./Admin/AdminAddBook.jsx";
import AdminBooks from "./Admin/AdminBooks.jsx";
import AdminOrders from "./Admin/AdminOrders.jsx";
import AdminUsers from "./Admin/AdminUsers.jsx";
import SiteSettings from "./Admin/SiteSetting.jsx";
import AdminRequestDelivery from "./Admin/AdminRequestDelivery.jsx";

// Routes Protection
import Authprovider from "./Context/Authprovider.jsx";
import PrivateRoute from "./PrivetRouts/PrivetRoute.jsx";

import "leaflet/dist/leaflet.css";
import MyDashboard from "./Dashboard/MyDashboard.jsx";

const router = createBrowserRouter([
  // ====================
  // MAIN LAYOUT
  // ====================
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <Error />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/books", element: <Books /> },
      {
        path: "/request-delivery",
        element: (
          <PrivateRoute>
            <RequestDelivery />
          </PrivateRoute>
        ),
      },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      {
        path: "/books/:id",
        element: (
          <PrivateRoute>
            <BookDetails />
          </PrivateRoute>
        ),
      },
    ],
  },

  // ====================
  // DASHBOARD LAYOUT
  // ====================
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      // ====================
      // USER DEFAULT DASHBOARD
      // ====================
      {
        path: "user",
        element: <UserDashboard></UserDashboard>,
        children: [
      { path: "profile", element: <MyProfile /> },
      { path: "my-orders", element: <MyOrders /> },
      { path: "invoices", element: <Invoices /> },
      { path: "my-orders/payment/:id", element: <PaymentPage /> },
        ]
      },

    

      // ====================
      // LIBRARIAN ROUTES
      // ====================
      {
        path: "librarian",
        element: <LibrarianDashboard />,
        children: [
          { path: "dashboard", element: <ManageBooks /> },
          { path: "manage-books", element: <ManageBooks /> },
          { path: "add-book", element: <AddBook /> },
          { path: "edit-book/:id", element: <EditBook /> },
          { path: "requests", element: <ManageRequests /> },
          { path: "returns", element: <ManageReturns /> },
          { path: "reports", element: <Reports /> },
        ],
      },

      // ====================
      // ADMIN ROUTES
      // ====================
      {
        path: "admin",
        element: <AdminDashboard />,
        children: [
          { path: "dashboard", element: <AdminAddBook /> },
          { path: "monthlySales", element: <SalesChart /> },
          { path: "add-books", element: <AdminAddBook /> },
          { path: "books", element: <AdminBooks /> },
          { path: "orders", element: <AdminOrders /> },
          { path: "users", element: <AdminUsers /> },
          { path: "site-setting", element: <SiteSettings /> },
          { path: "request-delivery", element: <AdminRequestDelivery /> },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Authprovider>
      <RouterProvider router={router} />
    </Authprovider>
  </StrictMode>
);
