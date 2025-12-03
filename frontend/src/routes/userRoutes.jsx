import { Routes, Route } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout.jsx";

import LoginPage from "../pages/auth/LoginPage.jsx";
import RegisterPage from "../pages/auth/RegisterPage.jsx";
import DashboardPage from "../pages/dashboard/DashboardPage.jsx";
import RecordsPage from "../pages/records/RecordsPage.jsx";
import CategoriesPage from "../pages/categories/CategoriesPage.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";

function AppRoutes() {
  return (
    <Routes>
      {/* Public auth routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected area wrapped in layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/records" element={<RecordsPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;
