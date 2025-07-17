import { useLocation, useNavigate, useParams } from 'react-router-dom';
import ButtonCard from '../../components/ButtonCard';
import { Award, Clock, List, Home } from 'lucide-react';

const QuizResultsPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { score, totalQuestions, quizTitle, timeSpent } = location.state || {};
  const percentage = Math.round((score / totalQuestions) * 100);

  if (!score && score !== 0) {
    navigate(`/user/quiz/${id}/start`);
    return null;
  }

  const getResultColor = () => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getResultMessage = () => {
    if (percentage >= 80) return 'Excellent!';
    if (percentage >= 50) return 'Good job!';
    return 'Keep practicing!';
  };

  const minutes = Math.floor(timeSpent / 60);
  const seconds = timeSpent % 60;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Quiz Results</h1>
        <h2 className="text-xl text-gray-600">{quizTitle}</h2>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex flex-col items-center mb-6">
          <div className={`text-5xl font-bold mb-2 ${getResultColor()}`}>
            {percentage}%
          </div>
          <div className="text-lg font-medium mb-4">{getResultMessage()}</div>
          <div className="text-2xl font-semibold">
            {score} out of {totalQuestions} correct
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center bg-gray-50 p-4 rounded-lg">
            <Award className="text-yellow-500 mr-3" size={24} />
            <div>
              <div className="text-sm text-gray-500">Your Score</div>
              <div className="font-medium">{score}/{totalQuestions}</div>
            </div>
          </div>
          <div className="flex items-center bg-gray-50 p-4 rounded-lg">
            <Clock className="text-blue-500 mr-3" size={24} />
            <div>
              <div className="text-sm text-gray-500">Time Spent</div>
              <div className="font-medium">
                {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <ButtonCard
          onClick={() => navigate('/user/quiz')}
          color="primary"
          size="medium"
          className="flex items-center justify-center gap-2"
        >
          <List size={18} />
          View All Quizzes
        </ButtonCard>
        <ButtonCard
          onClick={() => navigate('/user/dashboard')}
          color="secondary"
          size="medium"
          className="flex items-center justify-center gap-2"
        >
          <Home size={18} />
          Back to Dashboard
        </ButtonCard>
      </div>
    </div>
  );
};

export default QuizResultsPage;