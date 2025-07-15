import { useEffect, useState } from "react";
import axios from "../../utils/axios";

const QuestionManagement = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuizId, setSelectedQuizId] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [questions, setQuestions] = useState([]);

  // Fetch quizzes on load
  useEffect(() => {
    fetchQuizzes();
  }, []);

  // Fetch quizzes
  const fetchQuizzes = async () => {
    try {
      const res = await axios.get("/api/admin/quizzes");
      setQuizzes(res.data);
    } catch (err) {
      alert("Failed to fetch quizzes");
    }
  };

  // Fetch existing questions for selected quiz
  const fetchQuestions = async (quizId) => {
    try {
      const res = await axios.get(`/api/admin/quizzes/${quizId}`);
      setQuestions(res.data.questions || []);
    } catch (err) {
      alert("Failed to fetch questions");
    }
  };

  const handleQuizChange = (e) => {
    const id = e.target.value;
    setSelectedQuizId(id);
    if (id) fetchQuestions(id);
  };

  const handleAddQuestion = async () => {
    if (!selectedQuizId || !questionText.trim()) {
      alert("Please select a quiz and enter question text.");
      return;
    }

    try {
      await axios.post(`/api/admin/quizzes/${selectedQuizId}/questions`, {
        question_text: questionText,
      });
      setQuestionText("");
      fetchQuestions(selectedQuizId);
    } catch (err) {
      alert("Error adding question.");
    }
  };

    // const handleQuestion = async (quizId) => {
    //   if (!window.confirm("Are you sure you want to delete this category?")) return;
    //   try {
    //     await axios.delete(`/api/admin/quizzes/${quizId}`);
    //     fetchQuestions();
    //   } catch (err) {
    //     alert("Error deleting category");
    //   }
    // };
    const handleDeleteQuestion = async (questionId) => {
      if (!window.confirm("Are you sure you want to delete this question?")) return;
      
      try {
        await axios.delete(`/api/admin/questions/${questionId}`);
        // Refresh the questions list
        fetchQuestions(selectedQuizId);
        alert('Question deleted successfully!');
      } catch (err) {
        console.error('Delete error:', err);
        alert(`Error deleting question: ${err.response?.data?.message || err.message}`);
      }
    };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow p-6 rounded">
      <h1 className="text-2xl font-bold mb-4">Add Questions to Quiz</h1>

      {/* Quiz Selector */}
      <div className="mb-4">
        <label className="block mb-2 font-medium">Select Quiz:</label>
        <select
          className="w-full border px-3 py-2 rounded"
          value={selectedQuizId}
          onChange={handleQuizChange}
        >
          <option value="">-- Select Quiz --</option>
          {quizzes.map((quiz) => (
            <option key={quiz.id} value={quiz.id}>
              {quiz.title}
            </option>
          ))}
        </select>
      </div>

      {/* Add Question */}
      {selectedQuizId && (
        <>
          <div className="flex space-x-4 mb-6">
            <input
              type="text"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Enter question"
              className="flex-1 border px-3 py-2 rounded"
            />
            <button
              onClick={handleAddQuestion}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add Question
            </button>
          </div>

          {/* Existing Questions */}
          <h2 className="text-lg font-semibold mt-6 mb-2">Questions</h2>
          <ul className="list-disc list-inside space-y-1">
            {questions.map((q, index) => (
              <li key={q.id}>
                <strong>Q{index + 1}:</strong> {q.question_text}
                <button
                  onClick={() => handleDeleteQuestion(q.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </li>
            ))}
            {questions.length === 0 && <p>No questions added yet.</p>}
           
          </ul>
        </>
      )}
    </div>
  );
};

export default QuestionManagement;
