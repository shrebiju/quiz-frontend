import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col justify-center items-center p-6">
      <div className="max-w-2xl w-full text-center space-y-6">
        <h1 className="text-4xl font-extrabold text-blue-600">Welcome to Simple Quiz System</h1>
        <p className="text-gray-600 text-lg">
          A minimal and modern quiz system for users and admins. Register to start taking quizzes or log in to manage them!
        </p>

        <div className="flex justify-center gap-4 mt-6">
          <Link
            to="/register"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow transition"
          >
            Register
          </Link>
          <Link
            to="/login"
            className="bg-gray-100 hover:bg-gray-200 text-blue-700 font-semibold px-6 py-3 rounded-lg border border-blue-600 transition"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
