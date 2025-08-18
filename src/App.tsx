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

function App() {
  return (
    <>
      <div className="app">
        <Router>
          <Routes>
            <Route path="/admin-dashboard" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="categories" element={<CategoriesList />} />
              <Route path="categories/new" element={<CreateCategory />} />
              <Route path="categories/edit/:id" element={<EditCategory />} />
              <Route path="products" element={<ProductList />} />
              <Route path="products/edit/:id" element={<EditProduct />} />
              <Route path="product/new" element={<CreateProduct />} />
              <Route path="discounts" element={<DiscountsList />} />
              {/*other routes here */}
            </Route>
            <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            {/*  other public routes here */}
          </Route>
          </Routes>
        </Router>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </>
  );
}

export default App;