import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Products from "./pages/Products";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import PlaceOrder from "./pages/PlaceOrder";
import Orders from "./pages/Orders";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile"; // new
import ProtectedRoute from "./components/ProtectedRoute"; // new
import AdminDashboard from "./pages/AdminPages/AdminDashboard"; // new
import AdminRoute from "./pages/AdminPages/AdminRoute"; // new

const App = () => {
  return (
    <div className="px-4 sm:px[5vw] md:px-[7vw] lg:px-[9vw]">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products/>} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/place-order" element={<PlaceOrder />} />
        <Route path="/orders" element={<Orders/>} />
        {/* new - profile page, only accessible when logged in */}
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        {/* new - admin panel, only accessible when logged in as admin */}
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      </Routes>
    </div>
  );
};

export default App;