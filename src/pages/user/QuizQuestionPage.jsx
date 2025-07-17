import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';
import ButtonCard from '../../components/ButtonCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import Timer from '../../components/Timer'; // Import the Timer component

const QuizPlayer = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const { attemptId, quiz, timeLimit } = location.state || {};
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`/api/quiz-attempts/${attemptId}/questions`);
        setQuestions(response.data.questions);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load questions');
      } finally {
        setLoading(false);
      }
    };

    if (!quiz?.questions) {
      fetchQuestions();
    } else {
      setQuestions(quiz.questions);
      setLoading(false);
    }
  }, [attemptId, quiz]);

  useEffect(() => {
    if (!attemptId || !quiz) {
      navigate(`/user/quiz/${id}/start`);
    }
  }, [attemptId, quiz, id, navigate]);

  const handleAnswerSelect = (questionId, answerId) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const answers = questions.map(question => ({
        question_id: question.id,
        answer_id: selectedAnswers[question.id] || null
      }));

      const response = await axios.post(`/api/quizzes/${id}/submit`, {
        attempt_id: attemptId,
        answers
      });

      navigate(`/user/quiz/${id}/results`, {
        state: {
          score: response.data.score,
          totalQuestions: questions.length,
          quizTitle: quiz.title,
          timeSpent: timeLimit - (location.state?.timeLeft || 0) // Use timeLeft from Timer if available
        }
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit quiz');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!questions.length) return <div className="p-6">No questions available for this quiz</div>;

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <div className="text-lg font-medium">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
        <Timer 
          initialTime={timeLimit} 
          onTimeout={handleSubmit} 
        />
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div 
          className="bg-blue-600 h-2 rounded-full" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">
          {currentQuestion.question_text}
        </h2>

        <div className="space-y-3">
          {currentQuestion.answers?.map(answer => (
            <div 
              key={answer.id} 
              className={`p-3 border rounded cursor-pointer transition-colors ${
                selectedAnswers[currentQuestion.id] === answer.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => handleAnswerSelect(currentQuestion.id, answer.id)}
            >
              {answer.answer_text}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <ButtonCard
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          color="secondary"
          size="medium"
        >
          Previous
        </ButtonCard>
        
        {currentQuestionIndex === questions.length - 1 ? (
          <ButtonCard
            onClick={handleSubmit}
            color="primary"
            size="medium"
          >
            Submit Quiz
          </ButtonCard>
        ) : (
          <ButtonCard
            onClick={handleNext}
            color="primary"
            size="medium"
          >
            Next
          </ButtonCard>
        )}
      </div>
    </div>
  );
};

export default QuizPlayer;