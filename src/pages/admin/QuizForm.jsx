import { useEffect, useState } from "react";
import axios from "../../utils/axios";

const QuizForm = () => {
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [difficultyId, setDifficultyId] = useState("");
  const [timeLimit, setTimeLimit] = useState("");
  const [categories, setCategories] = useState([]);
  const [difficulties, setDifficulties] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchCategories();
    fetchDifficulties();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/api/admin/categories");
      setCategories(res.data);
    } catch (err) {
      alert("Error fetching categories");
    }
  };

  const fetchDifficulties = async () => {
    try {
      const res = await axios.get("/api/admin/difficulty-levels");
      setDifficulties(res.data);
    } catch (err) {
      alert("Error fetching difficulty levels");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !categoryId || !difficultyId || !timeLimit) {
      alert("All fields are required");
      return;
    }

    try {
      const res = await axios.post("/api/admin/quizzes", {
        title,
        category_id: categoryId,
        difficulty_level_id: difficultyId,
        time_limit_minutes: timeLimit,
      });

      setMessage("✅ Quiz created successfully!");
      setTitle("");
      setCategoryId("");
      setDifficultyId("");
      setTimeLimit("");
    } catch (err) {
      alert("Error creating quiz");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Create New Quiz</h1>

      {message && <p className="mb-4 text-green-600">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter quiz title"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Difficulty Level</label>
          <select
            value={difficultyId}
            onChange={(e) => setDifficultyId(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select difficulty</option>
            {difficulties.map((diff) => (
              <option key={diff.id} value={diff.id}>
                {diff.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Time Limit (in minutes)</label>
          <input
            type="number"
            min="1"
            value={timeLimit}
            onChange={(e) => setTimeLimit(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter time limit"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Quiz
        </button>
      </form>
    </div>
  );
};

export default QuizForm;
