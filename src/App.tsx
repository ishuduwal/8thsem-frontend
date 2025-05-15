import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Layout } from "./admin/Layout"

function App() {


  return (
    <>
      <div className="app">
        <Router>
          <Routes>
            <Route path="/admin-dashboard" element={<Layout />} />    
          </Routes>
        </Router>
      </div>
    </>
  )
}

export default App
