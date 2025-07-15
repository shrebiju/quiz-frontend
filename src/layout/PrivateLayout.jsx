import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateLayout = () => {
  const { user, loading } = useAuth();

  if (loading) {
    console.log("🔄 Auth loading...");
    return <div className="p-4">Loading...</div>;
  }

  if (!user) {
    console.log("⛔ No user found. Redirecting to login.");
    return <Navigate to="/" />;
  }

  console.log("🔓 Authenticated user:", user);
  return (
    <div className="min-h-screen bg-gray-50">
      <Outlet />
    </div>
  );
};

export default PrivateLayout;
