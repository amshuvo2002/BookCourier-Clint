import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import MainLayout from "./MainLayout/MainLayout.jsx";
import Home from "./Components/Home.jsx";
import "leaflet/dist/leaflet.css";
import Books from "./Components/Books.jsx";
import RequestDelivery from "./Components/RequestDelivery.jsx";
import Login from "./Components/Login.jsx";
import Register from "./Components/Register.jsx";
import Authprovider from "./Context/Authprovider.jsx";
import MyProfile from "./Dashboard/MyProfile.jsx";
import Error from "./Components/Error.jsx";
import BookDetails from "./Components/BooksDetails.jsx";

// Dashboard
import DashboardLayout from "./Dashboard/DashboardLayout.jsx";
import MyOrders from "./Dashboard/MyOrders.jsx";
import Invoices from "./Dashboard/Invoice.jsx";
import SalesChart from "./Pages/SalesChart.jsx";
import PrivateRoute from "./PrivetRouts/PrivetRoute.jsx";
import PaymentPage from "./Pages/Payment.jsx";
import LibrarianRoute from "./PrivetRouts/LibrarianRoute.jsx";
import LibrarianDashboard from "./Librarian/LibrarianDashboard.jsx";
import ManageBooks from "./Librarian/ManageBooks.jsx";
import AddBook from "./Librarian/AddBook.jsx";
import EditBook from "./Librarian/EditBook.jsx";
import ManageRequests from "./Librarian/ManageRequset.jsx";
import ManageReturns from "./Librarian/ManageReturns.jsx";
import Reports from "./Librarian/Reports.jsx";
import AdminRoute from "./PrivetRouts/AdminRoute.jsx";
import AdminAddBook from "./Admin/AdminAddBook.jsx";
import AdminBooks from "./Admin/AdminBooks.jsx";
import AdminOrders from "./Admin/AdminOrders.jsx";
import AdminUsers from "./Admin/AdminUsers.jsx";
import SiteSettings from "./Admin/SiteSetting.jsx";
import AdminRequestDelivery from "./Admin/AdminRequestDelivery.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout></MainLayout>,
    errorElement: <Error></Error>,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
      {
        path: "/Books",
        element: <Books></Books>,
      },
      {
        path: "/Request-Delivery",
        element: (
          <PrivateRoute>
            <RequestDelivery></RequestDelivery>
          </PrivateRoute>
        ),
      },
      {
        path: "/Login",
        element: <Login></Login>,
      },
      {
        path: "/Register",
        element: <Register></Register>,
      },
      {
        path: "/Books/:id",
        element: (
          <PrivateRoute>
            <BookDetails></BookDetails>
          </PrivateRoute>
        ),
      },
    ],
  },

  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      { path: "monthlySales", element: <SalesChart></SalesChart> },
      // User
      { path: "my-orders", element: <MyOrders /> },
      { path: "profile", element: <MyProfile /> },
      { path: "invoices", element: <Invoices /> },
      { path: "my-orders/payment/:id", element: <PaymentPage /> },
      {path: "admin/users", element: <AdminUsers></AdminUsers>}
    ],
  },

  {
    path: "/dashboard/librarian",
    element: (
      <LibrarianRoute>
        <LibrarianDashboard />
      </LibrarianRoute>
    ),
    children: [
      { path: "manage-books", element: <ManageBooks /> },
      { path: "add-book", element: <AddBook /> },
      { path: "edit-book/:id", element: <EditBook /> },
      { path: "requests", element: <ManageRequests /> },
      { path: "returns", element: <ManageReturns /> },
      { path: "reports", element: <Reports /> },
    ],
  },

  // ADMIN ROUTES
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      // ===== ADMIN ONLY ROUTES =====
      {
        path: "admin/add-books",
        element: (
          <AdminRoute>
            <AdminAddBook />
          </AdminRoute>
        ),
      },
      {
        path: "admin/books",
        element: (
          <AdminRoute>
            <AdminBooks />
          </AdminRoute>
        ),
      },
      {
        path: "admin/orders",
        element: (
          <AdminRoute>
            <AdminOrders />
          </AdminRoute>
        ),
      },
      // {
      //   path: "admin/users",
      //   element: (
      //     <AdminRoute>
      //       <AdminUsers />
      //     </AdminRoute>
      //   ),
      // },
      {
        path: "admin/site-setting",
        element: (
          <AdminRoute>
            <SiteSettings />
          </AdminRoute>
        ),
      },
      {
        path: "admin/request-delivery",
        element: (
          <AdminRoute>
            <AdminRequestDelivery></AdminRequestDelivery>
          </AdminRoute>
        ),
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
