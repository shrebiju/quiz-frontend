import { useEffect, useState } from "react";
import axios from "../../utils/axios";

const AnswerManagement = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedQuizId, setSelectedQuizId] = useState("");
  const [selectedQuestionId, setSelectedQuestionId] = useState("");
  const [answers, setAnswers] = useState([]);
  const [answerText, setAnswerText] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);

  // Fetch quizzes on mount
  useEffect(() => {
    const fetchQuizzes = async () => {
      const res = await axios.get("/api/admin/quizzes");
      setQuizzes(res.data);
    };
    fetchQuizzes();
  }, []);

  // Fetch questions when a quiz is selected
  useEffect(() => {
    if (selectedQuizId) {
      const fetchQuestions = async () => {
        const res = await axios.get(`/api/admin/quizzes/${selectedQuizId}`);
        setQuestions(res.data.questions);
      };
      fetchQuestions();
    }
  }, [selectedQuizId]);

  // Fetch answers when a question is selected
  useEffect(() => {
    if (selectedQuestionId) {
      const fetchAnswers = async () => {
        const res = await axios.get(`/api/admin/questions/${selectedQuestionId}/answers`);
        setAnswers(res.data);
      };
      fetchAnswers();
    }
  }, [selectedQuestionId]);

  const handleAddAnswer = async () => {
    if (!answerText.trim()) return;

    try {
      await axios.post(`/api/admin/questions/${selectedQuestionId}/answers`, {
        answer_text: answerText,
        is_correct: isCorrect,
      });
      setAnswerText("");
      setIsCorrect(false);
      const res = await axios.get(`/api/admin/questions/${selectedQuestionId}/answers`);
      setAnswers(res.data);
    } catch (err) {
        if (err.response?.status === 400) {
          alert(err.response.data.message); 
        } else {
          alert("Something went wrong");
        }
    }
  };



  
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Answer Management</h2>

      <div className="mb-4 space-y-4">
        <div>
          <label className="block mb-1">Select Quiz:</label>
          <select
            value={selectedQuizId}
            onChange={(e) => {
              setSelectedQuizId(e.target.value);
              setSelectedQuestionId(""); // Reset question
              setAnswers([]); // Clear previous answers
            }}
            className="border p-2 rounded w-full"
          >
            <option value="">-- Select Quiz --</option>
            {quizzes.map((quiz) => (
              <option key={quiz.id} value={quiz.id}>
                {quiz.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">Select Question:</label>
          <select
            value={selectedQuestionId}
            onChange={(e) => setSelectedQuestionId(e.target.value)}
            className="border p-2 rounded w-full"
            disabled={!selectedQuizId}
          >
            <option value="">-- Select Question --</option>
            {questions.map((q) => (
              <option key={q.id} value={q.id}>
                {q.question_text}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Add Answer Form */}
      {selectedQuestionId && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Add Answer</h3>
          <input
            type="text"
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            placeholder="Enter answer text"
            className="border p-2 rounded w-full mb-2"
          />
          <label className="inline-flex items-center mb-4">
            <input
              type="checkbox"
              checked={isCorrect}
              onChange={(e) => setIsCorrect(e.target.checked)}
              className="mr-2"
            />
            Is Correct?
          </label>
          <br />
          <button
            onClick={handleAddAnswer}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Answer
          </button>
        </div>
      )}

      {/* Display Answers */}
      {answers.length > 0 && (
        <div>
          <h3 className="text-lg font-bold mb-2">Existing Answers</h3>
          <table className="w-full border table-auto">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-2">#</th>
                <th className="p-2">Answer</th>
                <th className="p-2">Correct</th>
              </tr>
            </thead>
            <tbody>
              {answers.map((a, idx) => (
                <tr key={a.id} className="border-t">
                  <td className="p-2">{idx + 1}</td>
                  <td className="p-2">{a.answer_text}</td>
                  <td className="p-2">{a.is_correct ? "✅" : "❌"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AnswerManagement;
