import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';
import ButtonCard from '../../components/ButtonCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import Timer from '../../components/Timer';
import * as Yup from 'yup';
import NoDataFound from '../../components/NoDataFound';

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
  const [validationError, setValidationError] = useState('');

  // Validation schema for current question
  const answerSchema = Yup.object().shape({
    answer: Yup.string()
      .required('Please select an answer before continuing')
      .nullable()
  });

  console.log(questions,"questionsquestionsquestionsquestions")
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
    setValidationError(''); // Clear validation error when selecting an answer
  };

  const validateCurrentAnswer = async () => {
    try {
      await answerSchema.validate({
        answer: selectedAnswers[questions[currentQuestionIndex].id] || null
      });
      return true;
    } catch (err) {
      setValidationError(err.message);
      return false;
    }
  };

  const handleNext = async () => {
    const isValid = await validateCurrentAnswer();
    if (isValid && currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setValidationError('');
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setValidationError('');
    }
  };

  const handleSubmit = async () => {
    const isValid = await validateCurrentAnswer();
    if (!isValid) return;

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
          timeSpent: timeLimit - (location.state?.timeLeft || 0)
        }
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit quiz');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  
  if (!questions.length) {
    return (
      <div className="p-6">       
        <NoDataFound message="This quiz currently has no questions. Please try another quiz." />
      </div>
    );
  }
  // if (questions?.length === 0) {
  //   return (
  //     <div className="p-6">
  //       <NoDataFound message="This quiz currently has no questions. Please try another quiz." />
  //     </div>
  //   );
  // }
  // if (!questions.length) return <NoDataFound message="This Quiz have not any question for now. Please Try another Quiz for now on" />;


  // if (!questions || questions.length === 0) {
  //   return <NoDataFound message="This quiz has no questions available. Please try another quiz." />
  // };
  

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

        {validationError && (
          <div className="mt-4 text-red-500 text-sm">{validationError}</div>
        )}
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
            disabled={!selectedAnswers[currentQuestion.id]}
          >
            Submit Quiz
          </ButtonCard>
        ) : (
          <ButtonCard
            onClick={handleNext}
            color="primary"
            size="medium"
            disabled={!selectedAnswers[currentQuestion.id]}
          >
            Next
          </ButtonCard>
        )}
      </div>
    </div>
  );
};

export default QuizPlayer;