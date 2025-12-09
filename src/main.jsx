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
import UserRoute from './PrivetRouts/UserRoute.jsx';
import LibrarianRoute from './PrivetRouts/LibrarianRoute.jsx';
import AdminRoute from './PrivetRouts/AdminRoute.jsx';
import PaymentPage from './Pages/Payment.jsx';
import { path } from 'framer-motion/m';

     
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
        element: <PrivateRoute><BookDetails></BookDetails></PrivateRoute>
      },
      
    ]
  },

{
  path: "/dashboard",
  element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
  children: [
  
    {path: "monthlySales", element: <SalesChart></SalesChart>},
    // User
    { path: "my-orders", element: <MyOrders />, },
    { path: "profile", element:  <MyProfile /> },
    { path: "invoices", element:  <Invoices /> },
    { path: "my-orders/payment/:id", element: <PaymentPage /> },
    

    // Librarian
    { path: "add-book", element: <LibrarianRoute><AddBook /></LibrarianRoute> },
    { path: "my-books", element: <LibrarianRoute><MyBooks /></LibrarianRoute>},
    { path: "orders", element: <LibrarianRoute><Orders /></LibrarianRoute> },

    // Admin
    { path: "users", element: <AdminRoute><AdminUsers /></AdminRoute> },
    { path: "orders", element: <AdminRoute><AdminOrders /></AdminRoute> },
    { path: "books", element: <AdminRoute><AdminBooks /></AdminRoute> },
    { path: "add-book", element: <AdminRoute><AdminAddBook /></AdminRoute>},
    { path: "settings", element: <AdminRoute><SiteSettings /></AdminRoute>},
    { path: "monthlySales", element: <AdminRoute><SalesChart /></AdminRoute> },
  ]
}

]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Authprovider>
       <RouterProvider router={router} />
    </Authprovider>
  </StrictMode>
)
