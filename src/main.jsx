import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import MainLayout from './MainLayout/MainLayout.jsx';
import Home from './Components/Home.jsx';
import 'leaflet/dist/leaflet.css';
import Books from './Components/Books.jsx';
import RequestDelivery from './Components/RequestDelivery.jsx';
import Login from './Components/Login.jsx';
import Register from './Components/Register.jsx';
import Authprovider from './Context/Authprovider.jsx';
import MyProfile from './Dashboard/MyProfile.jsx'
import Error from './Components/Error.jsx';
import BookDetails from './Components/BooksDetails.jsx';

// Dashboard
import DashboardLayout from './Dashboard/DashboardLayout.jsx';
import MyOrders from './Dashboard/MyOrders.jsx';
import Invoices from './Dashboard/Invoice.jsx';
import AddBook from './Pages/AddBooks.jsx';
import MyBooks from './Pages/MyBooks.jsx';
import Orders from './Pages/Orders.jsx';
import AdminUsers from './Admin/AdminUsers.jsx';
import AdminOrders from './Admin/AdminOrders.jsx';
import AdminBooks from './Admin/AdminBooks.jsx';
import AdminAddBook from './Admin/AdminAddBook.jsx';
import SiteSettings from './Admin/SiteSetting.jsx';
import SalesChart from './Pages/SalesChart.jsx';
import PrivateRoute from './PrivetRouts/PrivetRoute.jsx';

     
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
        path:"/Books",
        element: <Books></Books>
      },
      {
        path:"/Request-Delivery",
        element: <PrivateRoute><RequestDelivery></RequestDelivery></PrivateRoute>
      },
      {
        path:"/Login",
        element: <Login></Login>
      },
      {
        path:"/Register",
        element: <Register></Register>
      },
      {
        path: "/Books/:id",
        element: <BookDetails></BookDetails>
      },
    ]
  },

  // ⭐⭐⭐ Dashboard Routes here ⭐⭐⭐
 {
  path: "/dashboard",
  element: <PrivateRoute><DashboardLayout></DashboardLayout></PrivateRoute>,
  children: [
    // User
    { path: "my-orders", element: <MyOrders /> },
    { path: "profile", element: <MyProfile /> },
    { path: "invoices", element: <Invoices /> },

    // ⭐ Librarian
    { path: "add-book", element: <AddBook /> },
    { path: "my-books", element: <MyBooks /> },
    { path: "orders", element: <Orders /> },
    // Admin
      {
        path: "users",
        element: <AdminUsers></AdminUsers>
      },
      {
        path: "orders",
        element: <AdminOrders></AdminOrders>
      },
      {
        path: "books",
        element: <AdminBooks></AdminBooks>
      },
      {
        path: "add-book",
        element: <AdminAddBook></AdminAddBook>
      },
      {
        path: "settings",
        element: <SiteSettings></SiteSettings>
      },
      {
        path:"monthlySales",
        element: <SalesChart></SalesChart>
      }
  ]
},
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Authprovider>
       <RouterProvider router={router} />
    </Authprovider>
  </StrictMode>
)
