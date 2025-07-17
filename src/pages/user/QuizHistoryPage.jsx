import { useEffect, useState } from 'react';
import axios from '../../utils/axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import NoDataFound from '../../components/NoDataFound';
import { Clock, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuizHistoryPage = () => {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const response = await axios.get('/api/my-attempts');
        setAttempts(response.data.attempts || []);
      } catch (error) {
        console.error('Error fetching attempts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttempts();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Quiz History</h1>
      
      {attempts.length === 0 ? (
        <NoDataFound message="You haven't completed any quizzes yet" />
      ) : (
        <div className="space-y-4">
          {attempts.map(attempt => {
            const percentage = Math.round((attempt.score / attempt.total_questions) * 100);
            const date = new Date(attempt.completed_at).toLocaleString();
            const timeSpent = Math.floor(
              (new Date(attempt.completed_at) - new Date(attempt.started_at)) / 1000
            );
            
            return (
              <div 
                key={attempt.id} 
                className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/user/quiz/${attempt.quiz_id}/results`, { 
                  state: { 
                    score: attempt.score,
                    totalQuestions: attempt.total_questions,
                    quizTitle: attempt.quiz?.title || 'Quiz',
                    timeSpent: timeSpent
                  }
                })}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold">{attempt.quiz?.title || 'Quiz'}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    percentage >= 80 ? 'bg-green-100 text-green-800' :
                    percentage >= 50 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {percentage}%
                  </span>
                </div>
                
                <div className="flex items-center text-gray-600 mb-1">
                  <Clock size={16} className="mr-2" />
                  <span className="text-sm">{date}</span>
                </div>
                
                <div className="flex items-center text-gray-600 mb-2">
                  <Award size={16} className="mr-2" />
                  <span className="text-sm">
                    {attempt.score} correct ({percentage}%)
                  </span>
                </div>
                
                <div className="flex items-center mt-2 space-x-1">
                  {Array.from({ length: attempt.total_questions }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-2 rounded-full ${
                        i < attempt.score ? 'bg-green-500' : 'bg-gray-200'
                      }`} 
                      style={{ width: `${100/attempt.total_questions}%` }} 
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default QuizHistoryPage;