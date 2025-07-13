import React from 'react';
import { Outlet } from 'react-router-dom';

const PublicLayout = () => {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <Outlet />
    </main>
  );
};

export default PublicLayout;
