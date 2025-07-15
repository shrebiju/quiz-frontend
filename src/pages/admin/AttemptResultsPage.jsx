import { useEffect, useState } from "react";
import axios from "../../utils/axios";

const AttemptResultsPage = () => {
  const [attempts, setAttempts] = useState([]);

  useEffect(() => {
    fetchAttempts();
  }, []);


  const fetchAttempts = async () => {
    try {
      const res = await axios.get("/api/admin/quiz-attempts");
      setAttempts(res.data.data); // 👈 Use .data.data for Laravel paginated response
    } catch (err) {
      alert("Failed to fetch quiz attempts.");
    }
  };
  

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">User Quiz Attempts</h2>

      <table className="w-full border table-auto text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">#</th>
            <th className="p-2 border">User</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Quiz</th>
            <th className="p-2 border">Score</th>
            <th className="p-2 border">Total</th>
            <th className="p-2 border">Started</th>
            <th className="p-2 border">Completed</th>
          </tr>
        </thead>
        <tbody>
          {attempts.length === 0 ? (
            <tr>
              <td colSpan="8" className="p-4 text-center">No attempts found</td>
            </tr>
          ) : (
            attempts.map((attempt, index) => (
              <tr key={attempt.id} className="text-center">
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">{attempt.user?.name}</td>
                <td className="border p-2">{attempt.user?.email}</td>
                <td className="border p-2">{attempt.quiz?.title}</td>
                <td className="border p-2">{attempt.score}</td>
                <td className="border p-2">{attempt.total_questions}</td>
                <td className="border p-2">{new Date(attempt.started_at).toLocaleString()}</td>
                <td className="border p-2">{new Date(attempt.completed_at).toLocaleString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AttemptResultsPage;
