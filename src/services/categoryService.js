import axios from '../utils/axios';

export const fetchCategories = async () => {
  const response = await axios.get('/api/admin/categories');
  return response.data;
};

export const createCategory = async (data) => {
  const response = await axios.post('/api/admin/categories', data);
  return response.data;
};

export const updateCategory = async (id, data) => {
  const response = await axios.put(`/api/admin/categories/${id}`, data);
  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await axios.delete(`/api/admin/categories/${id}`);
  return response.data;
};
