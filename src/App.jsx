import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Nav from "../components/Nav";
import Home from "./pages/Home";
import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import Customers from "./pages/Customers";
import AddCustomer from "./pages/AddCustomer";
import EditCustomer from "./pages/EditCustomer";
import CashFlow from "./pages/CashFlow";
import Costs from "./pages/Costs";
import Login from "./pages/Login";
import "../styles/globals.css";
import "bootstrap/dist/css/bootstrap.css";

function App() {
  return (
    <BrowserRouter basename="/verly-admin-react">
      <Nav />
      <div className="mx-4">
        <Routes>
          <Route path="/" element={<Navigate to="/account/login" replace />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/add" element={<AddProduct />} />
          <Route path="/products/edit/:id" element={<EditProduct />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/customers/add" element={<AddCustomer />} />
          <Route path="/customers/edit/:id" element={<EditCustomer />} />
          <Route path="/cash-flow" element={<CashFlow />} />
          <Route path="/costs" element={<Costs />} />
          <Route path="/account/login" element={<Login />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;