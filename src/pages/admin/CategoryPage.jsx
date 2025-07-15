import { useEffect, useState } from "react";
import axios from "../../utils/axios";

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editedName, setEditedName] = useState("");

  // Fetch categories on load
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/api/admin/categories");
      setCategories(res.data);
    } catch (err) {
      alert("Error fetching categories");
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;

    try {
      await axios.post("/api/admin/categories", { name: newCategory });
      setNewCategory("");
      fetchCategories();
    } catch (err) {
      alert("Error adding category");
    }
  };

  const handleUpdateCategory = async (id) => {
    try {
      await axios.put(`/api/admin/categories/${id}`, { name: editedName });
      setEditingId(null);
      setEditedName("");
      fetchCategories();
    } catch (err) {
      alert("Error updating category");
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await axios.delete(`/api/admin/categories/${id}`);
      fetchCategories();
    } catch (err) {
      alert("Error deleting category");
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow p-6 rounded">
      <h1 className="text-2xl font-bold mb-4">Category Management</h1>

      <div className="flex space-x-4 mb-6">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New category name"
          className="flex-1 border px-3 py-2 rounded"
        />
        <button
          onClick={handleAddCategory}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add
        </button>
      </div>

      <table className="w-full table-auto border">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">#</th>
            <th className="p-2">Category Name</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat, index) => (
            <tr key={cat.id} className="border-t">
              <td className="p-2">{index + 1}</td>
              <td className="p-2">
                {editingId === cat.id ? (
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="border px-2 py-1 rounded"
                  />
                ) : (
                  cat.name
                )}
              </td>
              <td className="p-2 space-x-2">
                {editingId === cat.id ? (
                  <button
                    onClick={() => handleUpdateCategory(cat.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setEditingId(cat.id);
                      setEditedName(cat.name);
                    }}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => handleDeleteCategory(cat.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {categories.length === 0 && (
            <tr>
              <td className="p-4 text-center" colSpan={3}>
                No categories found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryPage;
