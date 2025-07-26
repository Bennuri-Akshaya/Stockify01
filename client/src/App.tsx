import React from "react";
import {
  BrowserRouter,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import Home from "./Pages/user/Home";
import Logout from "./Pages/user/Logout";
import UserSignIn from "./Pages/user/UserSignIn";
import UserSignup from "./Pages/user/UserSignup";
import Cart from "./Pages/user/Cart";
import AdminSignIn from "./Pages/admin/AdminSignIn";
import AdminSignup from "./Pages/admin/AdminSignup";
import Billing from "./Pages/admin/Billing";
import Dashboard from "./Pages/admin/Dashboard";
import Products from "./Pages/admin/Products";
import SalesHistory from "./Pages/admin/SalesHistory";

const routes = createBrowserRouter(
  createRoutesFromElements(
    <Route>
        <Route path="/usersignup" element={<UserSignup />} />
        <Route path="/usersignin" element={<UserSignIn />} />
       <Route path="/adminsignin" element={<AdminSignIn />} />
        <Route path="/adminsignup" element={<AdminSignup />} />
      <Route >    
        <Route path="/cart" element={<Cart />} />
      </Route>

      <Route path="/" element={<AppLayout />}>
       
        <Route path="/billing" element={<Billing />} />
        <Route index element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/saleshistory" element={<SalesHistory />} />
      </Route>
      <Route path="/logout" element={<Logout />} />
    </Route>
  )
);
const App = () => {
  return (
    <div>
      <RouterProvider router={routes} />
    </div>
  );
};

export default App;
