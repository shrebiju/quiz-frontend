import { useEffect, useState } from "react";
import axios from "../../utils/axios";

const DifficultyPage = () => {
  const [difficulties, setDifficulties] = useState([]);
  const [newDifficulty, setNewDifficulty] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editedName, setEditedName] = useState("");

  useEffect(() => {
    fetchDifficulties();
  }, []);

  const fetchDifficulties = async () => {
    try {
      const res = await axios.get("/api/admin/difficulty-levels");
      setDifficulties(res.data);
    } catch (err) {
      alert("Error fetching difficulty levels");
    }
  };

  const handleAddDifficulty = async () => {
    if (!newDifficulty.trim()) return;

    try {
      await axios.post("/api/admin/difficulty-levels", { name: newDifficulty });
      setNewDifficulty("");
      fetchDifficulties();
    } catch (err) {
      alert("Error adding difficulty level");
    }
  };

  const handleUpdateDifficulty = async (id) => {
    try {
      await axios.put(`/api/admin/difficulty-levels/${id}`, { name: editedName });
      setEditingId(null);
      setEditedName("");
      fetchDifficulties();
    } catch (err) {
      alert("Error updating difficulty level");
    }
  };

  const handleDeleteDifficulty = async (id) => {
    if (!window.confirm("Are you sure you want to delete this difficulty?")) return;
    try {
      await axios.delete(`/api/admin/difficulty-levels/${id}`);
      fetchDifficulties();
    } catch (err) {
      alert("Error deleting difficulty level");
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow p-6 rounded">
      <h1 className="text-2xl font-bold mb-4">Difficulty Level Management</h1>

      <div className="flex space-x-4 mb-6">
        <input
          type="text"
          value={newDifficulty}
          onChange={(e) => setNewDifficulty(e.target.value)}
          placeholder="New difficulty level name"
          className="flex-1 border px-3 py-2 rounded"
        />
        <button
          onClick={handleAddDifficulty}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add
        </button>
      </div>

      <table className="w-full table-auto border">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">#</th>
            <th className="p-2">Level Name</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {difficulties.map((level, index) => (
            <tr key={level.id} className="border-t">
              <td className="p-2">{index + 1}</td>
              <td className="p-2">
                {editingId === level.id ? (
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="border px-2 py-1 rounded"
                  />
                ) : (
                  level.name
                )}
              </td>
              <td className="p-2 space-x-2">
                {editingId === level.id ? (
                  <button
                    onClick={() => handleUpdateDifficulty(level.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setEditingId(level.id);
                      setEditedName(level.name);
                    }}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => handleDeleteDifficulty(level.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {difficulties.length === 0 && (
            <tr>
              <td className="p-4 text-center" colSpan={3}>
                No difficulty levels found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DifficultyPage;
