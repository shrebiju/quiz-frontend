import React from "react";
import { Routes, Route } from "react-router-dom";
import PublicLayout from "../layout/PublicLayout";

import PrivateLayout from "../layout/PrivateLayout";
// import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
// import AdminDashboard from "../pages/admin/AdminDashboard";
// import UserDashboard from "../pages/user/UserDashboard";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicLayout />}>
        {/* <Route path="/" element={<LoginPage />} /> */}
        <Route path="/register" element={<RegisterPage />} />
      </Route>
hello
      {/* Private routes */}
      <Route element={<PrivateLayout />}>
        {/* <Route path="/user/dashboard" element={<UserDashboard />} /> */}
        {/* <Route path="/admin/dashboard" element={<AdminDashboard />} /> */}
      </Route>
    </Routes>
  );
};

export default AppRoutes;
