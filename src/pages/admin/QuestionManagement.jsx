import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from '../../utils/axios';
import { toast } from 'react-toastify';
import { Trash2, Plus } from 'lucide-react';
import ButtonCard from '../../components/ButtonCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import NoDataFound from '../../components/NoDataFound';
import ConfirmationPage from '../../components/ConfirmationPage';

const QuestionManagement = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quizLoading, setQuizLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedQuizId, setSelectedQuizId] = useState('');

  const validationSchema = Yup.object({
    questionText: Yup.string()
      .required('Question text is required')
      .min(10, 'Must be at least 10 characters')
      .max(500, 'Must be 500 characters or less'),
  });

  const formik = useFormik({
    initialValues: {
      questionText: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!selectedQuizId) {
        toast.error('Please select a quiz first');
        return;
      }
      
      setIsSubmitting(true);
      try {
        await axios.post(`/api/admin/quizzes/${selectedQuizId}/questions`, {
          question_text: values.questionText,
        });
        toast.success('Question added successfully');
        formik.resetForm();
        fetchQuestions(selectedQuizId);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to add question');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  // Fetch quizzes on load
  useEffect(() => {
    const fetchQuizzes = async () => {
      setQuizLoading(true);
      try {
        const res = await axios.get("/api/admin/quizzes");
        setQuizzes(res.data);
      } catch (err) {
        toast.error('Failed to fetch quizzes');
      } finally {
        setQuizLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  // Fetch existing questions when quizId changes
  useEffect(() => {
    if (selectedQuizId) {
      fetchQuestions(selectedQuizId);
    } else {
      setQuestions([]);
    }
  }, [selectedQuizId]);

  // Fetch questions for selected quiz
  const fetchQuestions = async (quizId) => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/admin/quizzes/${quizId}`);
      setQuestions(res.data.questions || []);
    } catch (err) {
      toast.error('Failed to fetch questions');
    } finally {
      setLoading(false);
    }
  };

  const handleQuizChange = (e) => {
    const id = e.target.value;
    setSelectedQuizId(id);
  };

  const handleDeleteClick = (questionId) => {
    setDeleteId(questionId);
    setShowConfirmDialog(true);
  };

  const handleDeleteConfirm = async () => {
    setShowConfirmDialog(false);
    try {
      await axios.delete(`/api/admin/questions/${deleteId}`);
      toast.success('Question deleted successfully');
      fetchQuestions(selectedQuizId);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete question');
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Question Management</h1>

      {/* Quiz Selector */}
      <div className="mb-4">
        <label htmlFor="quizId" className="block mb-2 font-medium">
          Select Quiz:
        </label>
        <select
          id="quizId"
          name="quizId"
          onChange={handleQuizChange}
          value={selectedQuizId}
          className="w-full border px-3 py-2 rounded"
          disabled={quizLoading}
        >
          <option value="">-- Select Quiz --</option>
          {quizzes.map((quiz) => (
            <option key={quiz.id} value={quiz.id}>
              {quiz.title}
            </option>
          ))}
        </select>
        {!selectedQuizId && formik.submitCount > 0 && (
          <div className="text-red-500 mt-1">Please select a quiz</div>
        )}
      </div>

      {/* Always show the questions list when a quiz is selected */}
      {selectedQuizId && (
        <>
          {/* Add Question Form */}
          <form onSubmit={formik.handleSubmit} className="mb-8 bg-white p-4 rounded shadow">
            <div className="mb-4">
              <label htmlFor="questionText" className="block mb-2 font-medium">
                Question Text
              </label>
              <textarea
                id="questionText"
                name="questionText"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.questionText}
                placeholder="Enter your question here"
                className="w-full p-2 border rounded min-h-[100px]"
              />
              {formik.touched.questionText && formik.errors.questionText && (
                <div className="text-red-500 mt-1">{formik.errors.questionText}</div>
              )}
            </div>
            
            <ButtonCard
              type="submit"
              color="primary"
              size="medium"
              loading={isSubmitting}
              className="flex items-center gap-2"
            >
              <Plus size={18} />
              Add Question
            </ButtonCard>
          </form>

          {/* Existing Questions - Always visible when quiz is selected */}
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-xl font-semibold mb-4">Questions</h3>
            
            {loading ? (
              <LoadingSpinner />
            ) : questions.length === 0 ? (
              <NoDataFound message="No questions found for this quiz. Add your first question!" />
            ) : (
              <div className="space-y-3">
                {questions.map((question, index) => (
                  <div key={question.id} className="flex items-start justify-between p-3 border rounded hover:bg-gray-50">
                    <div className="flex-1">
                      <div className="flex items-start gap-2">
                        <span className="font-medium">Q{index + 1}:</span>
                        <span>{question.question_text}</span>
                      </div>
                    </div>
                    <ButtonCard
                      onClick={() => handleDeleteClick(question.id)}
                      color="danger"
                      size="small"
                      className="p-2"
                    >
                      <Trash2 size={16} />
                    </ButtonCard>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
      
      <ConfirmationPage
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Question"
        message="Are you sure you want to delete this question? This action cannot be undone."
        confirmText="Delete"
      />
    </div>
  );
};

export default QuestionManagement;