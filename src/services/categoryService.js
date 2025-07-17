// src/services/categoryService.js
import axios from "../axios";

export const fetchCategories = async () => {
  const response = await axios.get("/admin/categories");
  return response.data.data;
};

export const createCategory = async (data) => {
  const response = await axios.post("/admin/categories", data);
  return response.data.data;
};

export const updateCategory = async (id, data) => {
  const response = await axios.put(`/admin/categories/${id}`, data);
  return response.data.data;
};

export const deleteCategory = async (id) => {
  await axios.delete(`/admin/categories/${id}`);
};
