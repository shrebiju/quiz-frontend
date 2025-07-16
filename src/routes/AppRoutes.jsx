import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PublicLayout from "../layout/PublicLayout";
import RegisterPage from "../pages/RegisterPage";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import AdminDashboard from "../pages/admin/AdminDashboard";
// import { UserDashboard } from "../pages/user/UserDashboard";
import UserDashboard from "../pages/user/UserDashboard";
import CategoryPage from "../pages/admin/CategoryPage";
//import CategoryPage from "../pages/admin/categoryManagement/CategoryPage";
import PrivateLayout from "../layout/PrivateLayout";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../layout/DashboardLayout";
import DifficultyLevelPage from "../pages/admin/DifficultyLevelPage";
import QuestionManagement from "../pages/admin/QuestionManagement";
import AnswerManagement from "../pages/admin/AnswerManagement";
import AttemptResultsPage from "../pages/admin/AttemptResultsPage";
import QuizForm from "../pages/admin/QuizForm";
import QuizListPage from "../pages/user/QuizListPage";
import QuizQuestionPage from "../pages/user/QuizQuestionPage";
import QuizStartPage from "../pages/user/QuizStartPage";
import QuizResultsPage from "../pages/user/QuizResultsPage";

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
  {/* ✅ Admin Layout and Routes */}
  <Route
    path="/admin"
    element={
      <RoleProtectedRoute role="admin">
        <DashboardLayout />
      </RoleProtectedRoute>
    }
  >
    <Route path="dashboard" element={<AdminDashboard />} />
    <Route path="category" element={<CategoryPage />} />
    <Route path="difficultyLevel" element={<DifficultyLevelPage />} />
    <Route path="questions" element={<QuestionManagement />} />
    <Route path="answers" element={<AnswerManagement />} />
    <Route path="attemptResults" element={<AttemptResultsPage />} />
    <Route path="quizForm" element={<QuizForm />} />
    


    {/* Add more admin routes here: difficulty, question, etc */}
  </Route>

  {/* ✅ User Layout and Routes */}
  <Route
    path="/user"
    element={
      <RoleProtectedRoute role="user">
        <DashboardLayout />
      </RoleProtectedRoute>
    }
  >
    <Route path="dashboard" element={<UserDashboard />} />

    <Route path="quiz" element={<QuizListPage />} />
    <Route path="/user/quiz/:id/start" element={<QuizStartPage />} />

  <Route path="/user/quiz/:id/questions" element={<QuizQuestionPage />} />
  <Route path="/user/quiz/:id/results" element={<QuizResultsPage />} />
    {/* <Route path="quiz/:quizId/play" element={<QuizPlayer />} /> */}


    {/* <Route path="/user/quiz" element={<QuizListPage />} />
    <Route path="/user/quiz/:quizId/play" element={<QuizPlayer />} /> */}


    {/* Add more user routes here: quiz, score, etc */}
  </Route>
</Route>
    </Routes>
  );
};

export default AppRoutes;
