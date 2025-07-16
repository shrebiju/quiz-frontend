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

const AnswerManagement = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState({
    quizzes: true,
    questions: true,
    answers: true
  });
  const [deleteId, setDeleteId] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const validationSchema = Yup.object({
    quizId: Yup.string().required('Please select a quiz'),
    questionId: Yup.string().required('Please select a question'),
    answerText: Yup.string()
      .required('Answer text is required')
      .min(2, 'Must be at least 2 characters')
      .max(500, 'Must be 500 characters or less'),
    isCorrect: Yup.boolean()
  });

  const formik = useFormik({
    initialValues: {
      quizId: '',
      questionId: '',
      answerText: '',
      isCorrect: false
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await axios.post(`/api/admin/questions/${values.questionId}/answers`, {
          answer_text: values.answerText,
          is_correct: values.isCorrect,
        });
        toast.success('Answer added successfully');
        formik.setFieldValue('answerText', '');
        formik.setFieldValue('isCorrect', false);
        fetchAnswers(values.questionId);
      } catch (error) {
        if (error.response?.status === 400) {
          toast.error(error.response.data.message);
        } else {
          toast.error('Failed to add answer');
        }
      }
    },
  });

  // Fetch quizzes on mount
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await axios.get("/api/admin/quizzes");
        setQuizzes(res.data);
      } catch (err) {
        toast.error('Failed to fetch quizzes');
      } finally {
        setLoading(prev => ({ ...prev, quizzes: false }));
      }
    };
    fetchQuizzes();
  }, []);

  // Fetch questions when quiz is selected
  useEffect(() => {
    if (formik.values.quizId) {
      fetchQuestions(formik.values.quizId);
    } else {
      setQuestions([]);
      formik.setFieldValue('questionId', '');
    }
  }, [formik.values.quizId]);

  // Fetch answers when question is selected
  useEffect(() => {
    if (formik.values.questionId) {
      fetchAnswers(formik.values.questionId);
    } else {
      setAnswers([]);
    }
  }, [formik.values.questionId]);

  const fetchQuestions = async (quizId) => {
    setLoading(prev => ({ ...prev, questions: true }));
    try {
      const res = await axios.get(`/api/admin/quizzes/${quizId}`);
      setQuestions(res.data.questions || []);
    } catch (err) {
      toast.error('Failed to fetch questions');
    } finally {
      setLoading(prev => ({ ...prev, questions: false }));
    }
  };

  const fetchAnswers = async (questionId) => {
    setLoading(prev => ({ ...prev, answers: true }));
    try {
      const res = await axios.get(`/api/admin/questions/${questionId}/answers`);
      setAnswers(res.data || []);
    } catch (err) {
      toast.error('Failed to fetch answers');
    } finally {
      setLoading(prev => ({ ...prev, answers: false }));
    }
  };

  const handleDeleteClick = (answerId) => {
    setDeleteId(answerId);
    setShowConfirmDialog(true);
  };

  const handleDeleteConfirm = async () => {
    setShowConfirmDialog(false);
    try {
      await axios.delete(`/api/admin/answers/${deleteId}`);
      toast.success('Answer deleted successfully');
      fetchAnswers(formik.values.questionId);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete answer');
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Answer Management</h2>

      {/* Quiz and Question Selection */}
      <div className="mb-6 bg-white p-4 rounded shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Quiz Selector */}
          <div>
            <label htmlFor="quizId" className="block mb-2 font-medium">
              Select Quiz:
            </label>
            <select
              id="quizId"
              name="quizId"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.quizId}
              className="w-full border px-3 py-2 rounded"
              disabled={loading.quizzes}
            >
              <option value="">-- Select Quiz --</option>
              {quizzes.map((quiz) => (
                <option key={quiz.id} value={quiz.id}>
                  {quiz.title}
                </option>
              ))}
            </select>
            {formik.touched.quizId && formik.errors.quizId && (
              <div className="text-red-500 mt-1">{formik.errors.quizId}</div>
            )}
          </div>

          {/* Question Selector */}
          <div>
            <label htmlFor="questionId" className="block mb-2 font-medium">
              Select Question:
            </label>
            <select
              id="questionId"
              name="questionId"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.questionId}
              className="w-full border px-3 py-2 rounded"
              disabled={!formik.values.quizId || loading.questions}
            >
              <option value="">-- Select Question --</option>
              {questions.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.question_text.length > 50 
                    ? `${q.question_text.substring(0, 50)}...` 
                    : q.question_text}
                </option>
              ))}
            </select>
            {formik.touched.questionId && formik.errors.questionId && (
              <div className="text-red-500 mt-1">{formik.errors.questionId}</div>
            )}
          </div>
        </div>
      </div>

      {/* Add Answer Form */}
      {formik.values.questionId && (
        <form onSubmit={formik.handleSubmit} className="mb-8 bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-4">Add New Answer</h3>
          
          <div className="mb-4">
            <label htmlFor="answerText" className="block mb-2 font-medium">
              Answer Text
            </label>
            <textarea
              id="answerText"
              name="answerText"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.answerText}
              placeholder="Enter the answer text"
              className="w-full p-2 border rounded min-h-[80px]"
            />
            {formik.touched.answerText && formik.errors.answerText && (
              <div className="text-red-500 mt-1">{formik.errors.answerText}</div>
            )}
          </div>

          <div className="mb-4 flex items-center">
            <input
              id="isCorrect"
              name="isCorrect"
              type="checkbox"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              checked={formik.values.isCorrect}
              className="mr-2 h-5 w-5"
            />
            <label htmlFor="isCorrect" className="font-medium">
              Mark as Correct Answer
            </label>
          </div>

          <ButtonCard
            type="submit"
            color="primary"
            size="medium"
            className="flex items-center gap-2"
          >
            <Plus size={18} />
            Add Answer
          </ButtonCard>
        </form>
      )}

      {/* Answers List */}
      {formik.values.questionId && (
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-4">Existing Answers</h3>
          
          {loading.answers ? (
            <LoadingSpinner />
          ) : answers.length === 0 ? (
            <NoDataFound message="No answers found for this question. Add your first answer!" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 text-left">#</th>
                    <th className="p-3 text-left">Answer Text</th>
                    <th className="p-3 text-left">Correct</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {answers.map((answer, index) => (
                    <tr key={answer.id} className="border-t hover:bg-gray-50">
                      <td className="p-3">{index + 1}</td>
                      <td className="p-3">{answer.answer_text}</td>
                      <td className="p-3">
                        {answer.is_correct ? (
                          <span className="text-green-600 font-medium">✅ Correct</span>
                        ) : (
                          <span className="text-red-600">❌ Incorrect</span>
                        )}
                      </td>
                      <td className="p-3">
                        <ButtonCard
                          onClick={() => handleDeleteClick(answer.id)}
                          color="danger"
                          size="small"
                          className="p-2"
                        >
                          <Trash2 size={16} />
                        </ButtonCard>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <ConfirmationPage
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Answer"
        message="Are you sure you want to delete this answer? This action cannot be undone."
        confirmText="Delete"
      />
    </div>
  );
};

export default AnswerManagement;