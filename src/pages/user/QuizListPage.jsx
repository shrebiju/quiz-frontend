import { useEffect, useState } from "react";
import axios from "../../utils/axios";
import { Link } from "react-router-dom";

const QuizListPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const res = await axios.get("/api/quizzes");
      
      // Access the quizzes array from the response data
      if (res.data?.quizzes && Array.isArray(res.data.quizzes)) {
        setQuizzes(res.data.quizzes);
      } else {
        throw new Error("Invalid data format: Expected { quizzes: [...] }");
      }
    } catch (err) {
      console.error("Error fetching quizzes", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Available Quizzes</h1>

      {loading ? (
        <p>Loading...</p>
      ) : quizzes.length === 0 ? (
        <p>No quizzes available.</p>
      ) : (
        <ul className="space-y-4">
          {quizzes.map((quiz) => (
            <li key={quiz.id} className="border p-4 rounded shadow">
              <h2 className="text-lg font-semibold">{quiz.title}</h2>
              <p className="text-gray-600">
                Category: {quiz.category?.name || 'N/A'} | 
                Difficulty: {quiz.difficulty_level?.name || 'N/A'} | 
                Time: {quiz.time_limit_minutes} min
              </p>

                <Link
                to={`/user/quiz/${quiz.id}/start`}
                state={{ quiz }} // Pass the quiz data with navigation
                className="inline-block mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                Start Quiz
                </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default QuizListPage;