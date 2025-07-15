import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from '../../utils/axios';
import { useState, useEffect } from 'react';

const QuizStartPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [quiz, setQuiz] = useState(location.state?.quiz || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch quiz details if not passed via state
  useEffect(() => {
    if (!quiz) {
      const fetchQuiz = async () => {
        try {
          const res = await axios.get(`/api/quizzes/${id}`);
          setQuiz(res.data.quiz);
        } catch (err) {
          setError('Failed to load quiz details');
        }
      };
      fetchQuiz();
    }
  }, [id, quiz]);

//   const startQuiz = async () => {
//     setLoading(true);
//     try {
//       // Note: Changed from POST to GET to match your Laravel route
//       const response = await axios.get(`/api/quizzes/${id}/start`);
      
//       navigate(`/user/quiz/${id}/questions`, {
//         state: { 
//           attemptId: response.data.attempt_id,
//           quiz: response.data.quiz,
//           timeLimit: response.data.quiz.time_limit_minutes
//         }
//       });
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to start quiz');
//       setLoading(false);
//     }
//   };
  const startQuiz = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/quizzes/${id}/start`);
      
      if (response.data.quiz.questions.length !== 5) {
        alert('This quiz must have exactly 5 questions');
        return;
      }
      
      navigate(`/user/quiz/${id}/questions`, {
        state: { 
          attemptId: response.data.attempt_id,
          quiz: response.data.quiz  // Make sure this includes questions
        }
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start quiz');
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Ready to Start the Quiz?</h1>
      
      {quiz && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold">{quiz.title}</h2>
          <p>Category: {quiz.category?.name}</p>
          <p>Difficulty: {quiz.difficulty_level?.name}</p>
          <p>Time Limit: {quiz.time_limit_minutes} minutes</p>
          <p>Questions: {quiz.questions?.length || 5} (randomly selected)</p>
        </div>
      )}

      {error && <div className="text-red-500 mb-4">{error}</div>}
      
      <button
        onClick={startQuiz}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        disabled={loading || !quiz}
      >
        {loading ? 'Starting Quiz...' : 'Begin Quiz'}
      </button>
    </div>
  );
};

export default QuizStartPage;