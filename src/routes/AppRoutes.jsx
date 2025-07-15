import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PublicLayout from "../layout/PublicLayout";
import RegisterPage from "../pages/RegisterPage";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import AdminDashboard from "../pages/admin/AdminDashboard";
import { UserDashboard } from "../pages/user/UserDashboard";
import PrivateLayout from "../layout/PrivateLayout";
import { useAuth } from "../context/AuthContext";



const RoleProtectedRoute = ({ role, children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-4">Loading...</div>;

  if (!user) return <Navigate to="/" />;
  
  if (user.role !== role) {
    console.warn(`❌ Unauthorized access. Required: ${role}, Found: ${user.role}`);
    return <Navigate to={`/${user.role}/dashboard`} />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
      <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<PrivateLayout />}>
        <Route
          path="/admin/dashboard"
          element={
            <RoleProtectedRoute role="admin">
              <AdminDashboard />
            </RoleProtectedRoute>
          }
        />

        {/* ✅ Protected user route */}
        <Route
          path="/user/dashboard"
          element={
            <RoleProtectedRoute role="user">
              <UserDashboard />
            </RoleProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
