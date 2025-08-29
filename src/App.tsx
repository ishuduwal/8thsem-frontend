import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Layout } from "./admin/Layout";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Dashboard } from "./admin/Dashboard";
import CategoriesList from "./admin/category/CategoriesList";
import CreateCategory from "./admin/category/CreateCategory";
import EditCategory from "./admin/category/EditCategory";
import DiscountsList from "./admin/discount/DiscountsList";
import MainLayout from "./components/MainLayout";
import { Home } from "./components/home/Home";
import ProductList from "./admin/products/ProductList";
import EditProduct from "./admin/products/EditProduct";
import CreateProduct from "./admin/products/CreateProduct";
import Login from "./components/login/Login";
import Signup from "./components/signup/Signup";
import AuthLayout from "./components/AuthLayout";
import { ProductDetail } from "./components/product/ProductDetail";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPasswordOTP from "./components/auth/ResetPasswordOTP";
import './App.css'
import UserManagement from "./admin/user-management/UserManagement";
import { ProductsPage } from "./components/product/ProductsPage";
import { AdminRoute, AuthOnlyRoute } from "./components/ProtectedRoute";
import { CartPage } from "./components/cart/CartPage";
import { AdminOrdersPage } from "./admin/orders/AdminOrdersPage";

function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          {/* Admin Dashboard - only for Admins */}
          <Route
            path="/admin-dashboard"
            element={
              <AdminRoute>
                <Layout />
              </AdminRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="categories" element={<CategoriesList />} />
            <Route path="categories/new" element={<CreateCategory />} />
            <Route path="categories/edit/:id" element={<EditCategory />} />
            <Route path="products" element={<ProductList />} />
            <Route path="products/edit/:id" element={<EditProduct />} />
            <Route path="products/create" element={<CreateProduct />} />
            <Route path="discounts" element={<DiscountsList />} />
            <Route path="user-management" element={<UserManagement />} />
            <Route path="orders" element={<AdminOrdersPage />} />
          </Route>

          {/* Public Layout */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<CartPage />} />
          </Route>

          {/* Auth Routes - only if not logged in */}
          <Route
            path="/"
            element={
              <AuthOnlyRoute>
                <AuthLayout />
              </AuthOnlyRoute>
            }
          >
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password-otp" element={<ResetPasswordOTP />} />
          </Route>
        </Routes>
      </Router>

      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
}


export default App;