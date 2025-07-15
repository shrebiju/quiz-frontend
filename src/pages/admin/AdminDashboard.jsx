import { useNavigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { FaUserCircle, FaBars } from 'react-icons/fa';
import { MdLogout } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navItems = [
    { label: 'Home', path: '/admin/dashboard' },
    { label: 'Category', path: '/admin/category' },
    { label: 'Difficulty Level', path: '/admin/difficulty' },
    { label: 'Multiple Question', path: '/admin/questions' },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-800 text-white flex flex-col p-6 space-y-4">
        <h2 className="text-2xl font-bold mb-6">Quiz Admin</h2>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`py-2 px-4 rounded hover:bg-blue-600 ${
              location.pathname === item.path ? 'bg-blue-600' : ''
            }`}
          >
            {item.label}
          </Link>
        ))}
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between bg-white shadow px-6 py-4">
          <h1 className="text-lg font-semibold text-gray-700 capitalize">
            {user?.role === 'admin' ? 'Admin' : 'User'} Dashboard
          </h1>

          <div className="relative">
            <FaUserCircle
              size={28}
              className="text-gray-600 cursor-pointer"
              onClick={() => setShowDropdown((prev) => !prev)}
            />
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white border shadow rounded p-4 z-50 space-y-2 text-sm">
                <p><strong>Role:</strong> {user?.role}</p>
                <p><strong>Name:</strong> {user?.name}</p>
                <p><strong>Email:</strong> {user?.email}</p>
                <button
                  onClick={handleLogout}
                  className="mt-2 w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded flex items-center justify-center gap-2"
                >
                  <MdLogout />
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 bg-gray-100 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
