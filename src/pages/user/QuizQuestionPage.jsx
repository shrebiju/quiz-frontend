import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';

const QuizQuestionPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get data passed from QuizStartPage
  const { attemptId, quiz } = location.state || {};
  
  const [questions, setQuestions] = useState(quiz?.questions || []);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState((quiz?.time_limit_minutes || 10) * 60);
  const [loading, setLoading] = useState(!quiz?.questions);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If questions weren't passed in state, fetch them
    if (!quiz?.questions) {
      const fetchQuestions = async () => {
        try {
          const response = await axios.get(`/api/quizzes/${id}/questions`);
          setQuestions(response.data.questions || []);
        } catch (err) {
          setError('Failed to load questions');
          console.error('Error fetching questions:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchQuestions();
    }

    // Timer logic
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [id, quiz]);

  // If no attemptId or quiz, redirect back
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
          totalQuestions: response.data.total_questions,
          quizTitle: quiz.title
        }
      });
    } catch (err) {
      setError('Failed to submit quiz');
      console.error('Error submitting quiz:', err);
    }
  };

  if (loading) return <div className="p-6">Loading questions...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!questions.length) return <div className="p-6">No questions available for this quiz</div>;

  const currentQuestion = questions[currentQuestionIndex];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between mb-4">
        <div>
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
        <div>
          Time Left: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">
          {currentQuestion.question_text}
        </h2>

        <div className="space-y-2">
          {currentQuestion.answers?.map(answer => (
            <div key={answer.id} className="flex items-center">
              <input
                type="radio"
                id={`answer-${answer.id}`}
                name={`question-${currentQuestion.id}`}
                checked={selectedAnswers[currentQuestion.id] === answer.id}
                onChange={() => handleAnswerSelect(currentQuestion.id, answer.id)}
                className="mr-2"
              />
              <label htmlFor={`answer-${answer.id}`}>
                {answer.answer_text}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>
        
        {currentQuestionIndex === questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Submit Quiz
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizQuestionPage;