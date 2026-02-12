import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PrivateRoute } from "./auth/PrivateRoute";
import { Layout } from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CustomersPage from "./pages/CustomersPage";
import OrdersPage from "./pages/OrdersPage";
import ManagersPage from "./pages/ManagersPage";
import LocationsPage from "./pages/LocationsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="/orders" replace />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="orders/:id" element={<OrdersPage />} />
          <Route path="managers" element={<ManagersPage />} />
          <Route path="locations" element={<LocationsPage />} />
        </Route>
        <Route
          path="*"
          element={
            <div className="p-8 text-center text-gray-600">Page not found</div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
