import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Layout } from "./admin/Layout";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Dashboard } from "./admin/Dashboard";
import CategoriesList from "./admin/category/CategoriesList";
import CreateCategory from "./admin/category/CreateCategory";
import EditCategory from "./admin/category/EditCategory";

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