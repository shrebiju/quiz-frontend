import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner';
import NoDataFound from '../../components/NoDataFound';
import ButtonCard from '../../components/ButtonCard';
import { Play, Clock, Award, Layers, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const QuizListPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [difficulties, setDifficulties] = useState([]);
  const [loading, setLoading] = useState({
    quizzes: true,
    filters: true
  });
  const [filters, setFilters] = useState({
    categoryId: '',
    difficultyId: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch quizzes (using your existing endpoint structure)
        const quizzesRes = await axios.get('/api/quizzes');
        const quizzesData = quizzesRes.data?.quizzes || [];
        setQuizzes(quizzesData);
        
        // Extract unique categories and difficulties from quizzes
        const uniqueCategories = [];
        const uniqueDifficulties = [];
        const seenCategories = new Set();
        const seenDifficulties = new Set();
        
        quizzesData.forEach(quiz => {
          if (quiz.category && !seenCategories.has(quiz.category.id)) {
            seenCategories.add(quiz.category.id);
            uniqueCategories.push(quiz.category);
          }
          if (quiz.difficulty_level && !seenDifficulties.has(quiz.difficulty_level.id)) {
            seenDifficulties.add(quiz.difficulty_level.id);
            uniqueDifficulties.push(quiz.difficulty_level);
          }
        });
        
        setCategories(uniqueCategories);
        setDifficulties(uniqueDifficulties);
      } catch (error) {
        toast.error('Failed to load quiz data');
      } finally {
        setLoading({ quizzes: false, filters: false });
      }
    };
    
    fetchData();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredQuizzes = quizzes.filter(quiz => {
    return (
      (!filters.categoryId || (quiz.category && quiz.category.id == filters.categoryId)) &&
      (!filters.difficultyId || (quiz.difficulty_level && quiz.difficulty_level.id == filters.difficultyId))
    );
  });

  if (loading.filters) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Available Quizzes</h2>
      </div>

      {/* Filters - Only show if we have categories/difficulties */}
      {(categories.length > 0 || difficulties.length > 0) && (
        <div className="bg-white p-4 rounded shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {categories.length > 0 && (
              <div>
                <label htmlFor="categoryId" className="block mb-2 font-medium">
                  Category
                </label>
                <select
                  id="categoryId"
                  name="categoryId"
                  onChange={handleFilterChange}
                  value={filters.categoryId}
                  className="w-full p-2 border rounded"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {difficulties.length > 0 && (
              <div>
                <label htmlFor="difficultyId" className="block mb-2 font-medium">
                  Difficulty
                </label>
                <select
                  id="difficultyId"
                  name="difficultyId"
                  onChange={handleFilterChange}
                  value={filters.difficultyId}
                  className="w-full p-2 border rounded"
                >
                  <option value="">All Difficulties</option>
                  {difficulties.map((difficulty) => (
                    <option key={difficulty.id} value={difficulty.id}>
                      {difficulty.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex items-end">
              <ButtonCard
                onClick={() => setFilters({ categoryId: '', difficultyId: '' })}
                color="secondary"
                size="medium"
                className="w-full"
              >
                Clear Filters
              </ButtonCard>
            </div>
          </div>
        </div>
      )}

      {/* Quiz List */}
      {loading.quizzes ? (
        <LoadingSpinner />
      ) : filteredQuizzes.length === 0 ? (
        <NoDataFound message="No quizzes found matching your filters" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz) => (
            <div key={quiz.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold">{quiz.title}</h3>
                  {quiz.difficulty_level && (
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      quiz.difficulty_level.name === 'Beginner' ? 'bg-green-100 text-green-800' :
                      quiz.difficulty_level.name === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {quiz.difficulty_level.name}
                    </span>
                  )}
                </div>

                {quiz.category && (
                  <div className="flex items-center text-gray-600 mb-2">
                    <Layers size={16} className="mr-1" />
                    <span className="text-sm">{quiz.category.name}</span>
                  </div>
                )}

                <div className="flex items-center text-gray-600 mb-4">
                  <Clock size={16} className="mr-1" />
                  <span className="text-sm">{quiz.time_limit_minutes} minutes</span>
                </div>

                <div className="flex items-center text-gray-600 mb-4">
                  <BarChart2 size={16} className="mr-1" />
                  <span className="text-sm">5 random questions</span>
                </div>

                <Link
                  to={`/user/quiz/${quiz.id}/start`}
                  state={{ quiz }}
                  className="w-full"
                >
                  <ButtonCard
                    color="primary"
                    size="medium"
                    className="w-full mt-4 flex items-center justify-center gap-2"
                  >
                    <Play size={18} />
                    Start Quiz
                  </ButtonCard>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizListPage;