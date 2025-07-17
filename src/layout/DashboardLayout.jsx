import { useNavigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { MdLogout } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';
import ButtonCard from '../components/ButtonCard';
import { toast } from 'react-toastify';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      toast.success('Logged out successfully!');
      navigate('/');
    } catch (error) {
      toast.error('Failed to logout. Please try again.');
    } finally {
      setIsLoggingOut(false);
      setShowDropdown(false);
    }
  };

  const basePath = `/${user?.role}`;
  const navItems = user?.role === 'admin'
    ? [
        { label: 'Home', path: `${basePath}/dashboard` },
        { label: 'Categories', path: `${basePath}/category` },
        { label: 'Difficulty Level', path: `${basePath}/difficultyLevel` },
        { label: 'Quiz Form', path: `${basePath}/quizForm` },
        { label: 'Multiple Question', path: `${basePath}/questions` },
        { label: 'Answer Management', path: `${basePath}/answers` },
        { label: 'Attempt Results', path: `${basePath}/attemptResults` },
      ]
    : [
        { label: 'Home', path: `${basePath}/dashboard` },
        { label: 'View Quiz', path: `${basePath}/quiz` },
        // { label: 'Play Quiz', path: `${basePath}/quiz/:quizId/play` },
        // { label: 'View Score', path: `${basePath}/score` },
        { label: 'History Page', path: `${basePath}/my-attempts` },
      ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-800 text-white flex flex-col p-6 space-y-4">
        <h2 className="text-2xl font-bold mb-6 capitalize">
          {user?.role} Panel
        </h2>
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between bg-white shadow px-6 py-4">
          <h1 className="text-lg font-semibold text-gray-700 capitalize">
            {user?.role} Dashboard
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
                <ButtonCard
                  onClick={handleLogout}
                  color="danger"
                  size="small"
                  loading={isLoggingOut}
                  fullWidth
                  className="mt-2 flex items-center justify-center gap-2"
                >
                  <MdLogout />
                  Logout
                </ButtonCard>
              </div>
            )}
          </div>
        </header>
        <main className="p-6 bg-gray-100 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;