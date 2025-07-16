import React, { useState, useEffect } from 'react';
import axios from '../../../utils/axios';
import { toast } from 'react-toastify';
import CategoryForm from './CategoryForm';
import CategoryList from './CategoryList';
import ConfirmationPage from '../../../components/ConfirmationPage';

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/admin/categories');
      setCategories(response.data);
    } catch (error) {
      toast.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      if (editId) {
        await axios.put(`/api/admin/categories/${editId}`, values);
        toast.success('Category updated successfully');
      } else {
        await axios.post('/api/admin/categories', values);
        toast.success('Category added successfully');
      }
      fetchCategories();
      setEditId(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowConfirmDialog(true);
  };

  const handleDeleteConfirm = async () => {
    setShowConfirmDialog(false);
    try {
      await axios.delete(`/api/admin/categories/${deleteId}`);
      toast.success('Category deleted successfully');
      fetchCategories();
    } catch (error) {
      toast.error('Failed to delete category');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Category Management</h2>
      
      <CategoryForm
        editId={editId}
        categoryToEdit={categories.find(c => c.id === editId)}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />

      <CategoryList
        categories={categories}
        loading={loading}
        onEdit={(category) => {
          setEditId(category.id);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onDeleteClick={handleDeleteClick}
      />

      <ConfirmationPage
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Category"
        message="Are you sure you want to delete this category? This action cannot be undone."
        confirmText="Delete"
      />
    </div>
  );
};

export default CategoryPage;