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
import Dashboard from './Components/Dashboard.jsx';
import Login from './Components/Login.jsx';
import Register from './Components/Register.jsx';
import Authprovider from './Context/Authprovider.jsx';
import MyProflile from './Components/MyProfile.jsx'
import Error from './Components/Error.jsx';
import BookDetails from './Components/BooksDetails.jsx';


     
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
        element: <RequestDelivery></RequestDelivery>
      },
      {
        path:"/Dashboard",
        element: <Dashboard></Dashboard> 
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
        path: "/My-Profile",
        element: <MyProflile></MyProflile>
      },
      {
       path: "/Books/:id",
       element: <BookDetails></BookDetails>
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
