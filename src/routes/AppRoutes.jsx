import React from "react";
import { Routes, Route } from "react-router-dom";
import PublicLayout from "../layout/PublicLayout";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";


const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        {/* Add a root route */}
        <Route 
          path="/" 
          element={
            <div className="p-4">
              <h1 className="text-2xl font-bold">Hello from Home Page!</h1>
            </div>
          } 
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
