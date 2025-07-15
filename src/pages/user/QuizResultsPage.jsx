import { useLocation, useNavigate, useParams } from 'react-router-dom';

const QuizResultsPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const { score, totalQuestions, attemptId } = location.state || {};
  const percentage = Math.round((score / totalQuestions) * 100);

  if (!location.state) {
    navigate(`/user/quiz/${id}/start`);
    return null;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Quiz Results</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="text-center mb-4">
          <div className="text-4xl font-bold mb-2">{percentage}%</div>
          <div>
            You scored {score} out of {totalQuestions} questions correctly
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={() => navigate('/user/dashboard')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => navigate('/user/my-attempts')}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            View Attempt History
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizResultsPage;