import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

// Components
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/routing/ProtectedRoute";
import AdminRoute from "./components/routing/AdminRoute";

// Pages Map
import Home from "./pages/home/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Cart from "./pages/cart/Cart";
import UserProducts from "./pages/product/UserProducts";
import ProductDetails from "./pages/product/ProductDetails";

// Order Pages
import UserOrders from "./pages/order/UserOrders";
import AdminOrders from "./pages/order/AdminOrders";

// Admin Product Pages
import AdminProducts from "./pages/product/AdminProducts";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

// Payment Pages
import Checkout from "./pages/checkout/Checkout";
import PaymentSuccess from "./pages/payment/PaymentSuccess";
import PaymentFailure from "./pages/payment/PaymentFailure";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Layout>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/products" element={<UserProducts />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />

              <Route path="/forgot" element={<ForgotPassword />} />
              <Route path="/reset" element={<ResetPassword />} />

              {/* Checkout and Payment Routes */}
              <Route path="/checkout" element={
                <ProtectedRoute><Checkout /></ProtectedRoute>
              } />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/payment-failure" element={<PaymentFailure />} />

              {/* User protected routes */}
              <Route path="/orders" element={
                 <ProtectedRoute><UserOrders /></ProtectedRoute>
              } />

              {/* Admin protected routes */}
              <Route path="/admin/products" element={
                 <AdminRoute><AdminProducts /></AdminRoute>
              } />
              <Route path="/admin/orders" element={
                 <AdminRoute><AdminOrders /></AdminRoute>
              } />
              

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
