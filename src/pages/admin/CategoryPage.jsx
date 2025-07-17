import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from '../../utils/axios';
import { toast } from 'react-toastify';
import { Trash2, Edit, Plus } from 'lucide-react';
import ButtonCard from '../../components/ButtonCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import NoDataFound from '../../components/NoDataFound';
import ConfirmationPage from '../../components/ConfirmationPage';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const validationSchema = Yup.object({
    name: Yup.string()
      .required('Category name is required')
      .min(3, 'Must be at least 3 characters')
      .max(50, 'Must be 50 characters or less'),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema,
    onSubmit: async (values) => {
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
        formik.resetForm();
        setEditId(null);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Operation failed');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

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

  const handleEdit = (category) => {
    formik.setValues({ name: category.name });
    setEditId(category.id);
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
    } finally {
      setDeleteId(null);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Category Management</h2>
      <form onSubmit={formik.handleSubmit} className="mb-8 bg-white p-4 rounded shadow">
      <div className="mb-4">
        <label htmlFor="name" className="block mb-2 font-medium">
          Category Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.name}
          className="w-full p-2 border rounded"
        />
        {formik.touched.name && formik.errors.name && (
          <div className="text-red-500 mt-1">{formik.errors.name}</div>
        )}
      </div>
      
      <ButtonCard
        type="submit"
        color={editId ? "primary" : "success"}
        size="medium"
        loading={isSubmitting}
        className="flex items-center gap-2"
      >
        {editId ? <Edit size={18} /> : <Plus size={18} />}
        {editId ? 'Update Category' : 'Add Category'}
      </ButtonCard>
      
      {/* {editId && (
        <ButtonCard
          type="button"
          color="secondary"
          size="medium"
          onClick={() => {
            formik.resetForm();
            setEditId(null);
          }}
          className="ml-2"
        >
          Cancel
        </ButtonCard>
      )} */}
    </form>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-xl font-semibold mb-4">Categories List</h3>
        
        {loading ? (
          <LoadingSpinner />
        ) : categories.length === 0 ? (
          <NoDataFound message="No categories found. Add your first category!" />
        ) : (
          <div className="space-y-2">
            {categories.map((category, index) => (
              <div key={category.id} className="flex items-center justify-between p-3 border rounded hover:bg-gray-50">
                <span className="text-gray-500 w-6 text-right">{index + 1}.</span>
                <span className="font-medium">{category.name}</span>
                <div className="flex gap-2">
                  <ButtonCard
                    onClick={() => handleEdit(category)}
                    color="primary"
                    size="small"
                    className="p-2"
                  >
                    <Edit size={16} />
                  </ButtonCard>
                  <ButtonCard
                    onClick={() => handleDeleteClick(category.id)}
                    color="danger"
                    size="small"
                    className="p-2"
                  >
                    <Trash2 size={16} />
                  </ButtonCard>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
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

export default CategoryManagement;