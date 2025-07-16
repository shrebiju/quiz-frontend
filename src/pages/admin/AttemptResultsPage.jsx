import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner';
import NoDataFound from '../../components/NoDataFound';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ButtonCard from '../../components/ButtonCard';

const AttemptResultsPage = () => {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const fetchAttempts = async (page = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/admin/quiz-attempts?page=${page}&per_page=${perPage}`);
      setAttempts(res.data.data);
      setTotalPages(res.data.last_page);
      setCurrentPage(res.data.current_page);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch quiz attempts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttempts();
  }, [perPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchAttempts(newPage);
    }
  };

  const handlePerPageChange = (e) => {
    setPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">User Quiz Attempts</h2>

      <div className="bg-white p-6 rounded shadow">
        {/* Per Page Selector */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <label htmlFor="perPage" className="text-sm font-medium">
              Rows per page:
            </label>
            <select
              id="perPage"
              value={perPage}
              onChange={handlePerPageChange}
              className="border rounded p-1 text-sm"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border table-auto text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 border text-left">#</th>
                    <th className="p-3 border text-left">User</th>
                    <th className="p-3 border text-left">Email</th>
                    <th className="p-3 border text-left">Quiz</th>
                    <th className="p-3 border text-left">Score</th>
                    <th className="p-3 border text-left">Total</th>
                    <th className="p-3 border text-left">Percentage</th>
                    <th className="p-3 border text-left">Started</th>
                    <th className="p-3 border text-left">Completed</th>
                  </tr>
                </thead>
                <tbody>
                  {attempts.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="p-4">
                        <NoDataFound message="No quiz attempts found" />
                      </td>
                    </tr>
                  ) : (
                    attempts.map((attempt, index) => {
                      const percentage = attempt.total_questions > 0 
                        ? Math.round((attempt.score / attempt.total_questions) * 100) 
                        : 0;
                      return (
                        <tr key={attempt.id} className="hover:bg-gray-50">
                          <td className="border p-3">{(currentPage - 1) * perPage + index + 1}</td>
                          <td className="border p-3">{attempt.user?.name || 'N/A'}</td>
                          <td className="border p-3">{attempt.user?.email || 'N/A'}</td>
                          <td className="border p-3">{attempt.quiz?.title || 'N/A'}</td>
                          <td className="border p-3">{attempt.score}</td>
                          <td className="border p-3">{attempt.total_questions}</td>
                          <td className="border p-3">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              percentage >= 70 ? 'bg-green-100 text-green-800' :
                              percentage >= 50 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {percentage}%
                            </span>
                          </td>
                          <td className="border p-3">
                            {attempt.started_at ? new Date(attempt.started_at).toLocaleString() : 'N/A'}
                          </td>
                          <td className="border p-3">
                            {attempt.completed_at ? new Date(attempt.completed_at).toLocaleString() : 'Incomplete'}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {attempts.length > 0 && (
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-gray-600">
                  Showing {((currentPage - 1) * perPage) + 1} to {Math.min(currentPage * perPage, totalPages * perPage)} of {totalPages * perPage} entries
                </div>
                <div className="flex gap-2">
                  <ButtonCard
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    size="small"
                    className="p-2"
                  >
                    <ChevronLeft size={16} />
                  </ButtonCard>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <ButtonCard
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        color={currentPage === pageNum ? "primary" : "default"}
                        size="small"
                        className="min-w-[2rem]"
                      >
                        {pageNum}
                      </ButtonCard>
                    );
                  })}
                  <ButtonCard
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    size="small"
                    className="p-2"
                  >
                    <ChevronRight size={16} />
                  </ButtonCard>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AttemptResultsPage;