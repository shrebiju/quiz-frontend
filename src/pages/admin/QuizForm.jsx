import React, { useEffect,useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from '../../utils/axios';
import { toast } from 'react-toastify';
import ButtonCard from '../../components/ButtonCard';
import LoadingSpinner from '../../components/LoadingSpinner';

const QuizForm = () => {
  const [categories, setCategories] = useState([]);
  const [difficulties, setDifficulties] = useState([]);
  const [loading, setLoading] = useState({
    categories: true,
    difficulties: true,
    submitting: false
  });

  const validationSchema = Yup.object({
    title: Yup.string()
      .required('Quiz title is required')
      .min(5, 'Must be at least 5 characters')
      .max(100, 'Must be 100 characters or less'),
    categoryId: Yup.string().required('Category is required'),
    difficultyId: Yup.string().required('Difficulty level is required'),
    timeLimit: Yup.number()
      .required('Time limit is required')
      .min(1, 'Must be at least 1 minute')
      .max(300, 'Must be 300 minutes or less')
      .integer('Must be a whole number')
  });

  const formik = useFormik({
    initialValues: {
      title: '',
      categoryId: '',
      difficultyId: '',
      timeLimit: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(prev => ({ ...prev, submitting: true }));
      try {
        await axios.post("/api/admin/quizzes", {
          title: values.title,
          category_id: values.categoryId,
          difficulty_level_id: values.difficultyId,
          time_limit_minutes: values.timeLimit,
        });
        
        toast.success('Quiz created successfully!');
        formik.resetForm();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to create quiz');
      } finally {
        setLoading(prev => ({ ...prev, submitting: false }));
      }
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, difficultiesRes] = await Promise.all([
          axios.get("/api/admin/categories"),
          axios.get("/api/admin/difficulty-levels")
        ]);
        
        setCategories(categoriesRes.data);
        setDifficulties(difficultiesRes.data);
      } catch (error) {
        toast.error('Failed to load form data');
      } finally {
        setLoading({
          categories: false,
          difficulties: false,
          submitting: false
        });
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Quiz</h1>

      <form onSubmit={formik.handleSubmit} className="bg-white p-6 rounded shadow space-y-4">
        {/* Title Field */}
        <div>
          <label htmlFor="title" className="block mb-2 font-medium">
            Quiz Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.title}
            className="w-full p-2 border rounded"
            placeholder="Enter quiz title"
          />
          {formik.touched.title && formik.errors.title && (
            <div className="text-red-500 mt-1">{formik.errors.title}</div>
          )}
        </div>

        {/* Category Field */}
        <div>
          <label htmlFor="categoryId" className="block mb-2 font-medium">
            Category
          </label>
          <select
            id="categoryId"
            name="categoryId"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.categoryId}
            className="w-full p-2 border rounded"
            disabled={loading.categories}
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {formik.touched.categoryId && formik.errors.categoryId && (
            <div className="text-red-500 mt-1">{formik.errors.categoryId}</div>
          )}
        </div>

        {/* Difficulty Field */}
        <div>
          <label htmlFor="difficultyId" className="block mb-2 font-medium">
            Difficulty Level
          </label>
          <select
            id="difficultyId"
            name="difficultyId"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.difficultyId}
            className="w-full p-2 border rounded"
            disabled={loading.difficulties}
          >
            <option value="">Select difficulty</option>
            {difficulties.map((diff) => (
              <option key={diff.id} value={diff.id}>
                {diff.name}
              </option>
            ))}
          </select>
          {formik.touched.difficultyId && formik.errors.difficultyId && (
            <div className="text-red-500 mt-1">{formik.errors.difficultyId}</div>
          )}
        </div>

        {/* Time Limit Field */}
        <div>
          <label htmlFor="timeLimit" className="block mb-2 font-medium">
            Time Limit (minutes)
          </label>
          <input
            id="timeLimit"
            name="timeLimit"
            type="number"
            min="1"
            max="300"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.timeLimit}
            className="w-full p-2 border rounded"
            placeholder="Enter time limit"
          />
          {formik.touched.timeLimit && formik.errors.timeLimit && (
            <div className="text-red-500 mt-1">{formik.errors.timeLimit}</div>
          )}
        </div>

        <ButtonCard
          type="submit"
          color="primary"
          size="medium"
          loading={loading.submitting}
          className="w-full"
        >
          Create Quiz
        </ButtonCard>
      </form>
    </div>
  );
};

export default QuizForm;