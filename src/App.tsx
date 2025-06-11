import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Layout } from "./admin/Layout";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Dashboard } from "./admin/Dashboard";
import CategoriesList from "./admin/category/CategoriesList";
import CreateCategory from "./admin/category/CreateCategory";
import EditCategory from "./admin/category/EditCategory";
import ProductsList from "./admin/products/ProductsList";
import DiscountsList from "./admin/discount/DiscountsList";

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
              <Route path="products" element={<ProductsList />} />
              <Route path="discounts" element={<DiscountsList />} />
              {/* Add other routes here */}
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