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

const DifficultyPage = () => {
  const [difficulties, setDifficulties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const validationSchema = Yup.object({
    name: Yup.string()
      .required('Difficulty name is required')
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
          await axios.put(`/api/admin/difficulty-levels/${editId}`, values);
          toast.success('Difficulty updated successfully');
        } else {
          await axios.post('/api/admin/difficulty-levels', values);
          toast.success('Difficulty added successfully');
        }
        fetchDifficulties();
        formik.resetForm();
        setEditId(null);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Operation failed');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const fetchDifficulties = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/admin/difficulty-levels');
      setDifficulties(response.data);
    } catch (error) {
      toast.error('Failed to fetch difficulty levels');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (difficulty) => {
    formik.setValues({ name: difficulty.name });
    setEditId(difficulty.id);
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowConfirmDialog(true);
  };

  const handleDeleteConfirm = async () => {
    setShowConfirmDialog(false);
    try {
      await axios.delete(`/api/admin/difficulty-levels/${deleteId}`);
      toast.success('Difficulty deleted successfully');
      fetchDifficulties();
    } catch (error) {
      toast.error('Failed to delete difficulty');
    } finally {
      setDeleteId(null);
    }
  };

  useEffect(() => {
    fetchDifficulties();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Difficulty Level Management</h2>
      <form onSubmit={formik.handleSubmit} className="mb-8 bg-white p-4 rounded shadow">
        <div className="mb-4">
          <label htmlFor="name" className="block mb-2 font-medium">
            Difficulty Level Name
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
          {editId ? 'Update Difficulty' : 'Add Difficulty'}
        </ButtonCard>
      </form>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-xl font-semibold mb-4">Difficulty Levels</h3>
        
        {loading ? (
          <LoadingSpinner />
        ) : difficulties.length === 0 ? (
          <NoDataFound message="No difficulty levels found. Add your first difficulty level!" />
        ) : (
          <div className="space-y-2">
            {difficulties.map((difficulty, index) => (
              <div key={difficulty.id} className="flex items-center justify-between p-3 border rounded hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <span className="text-gray-500 w-6 text-right">{index + 1}.</span>
                  <span className="font-medium">{difficulty.name}</span>
                </div>
                <div className="flex gap-2">
                  <ButtonCard
                    onClick={() => handleEdit(difficulty)}
                    color="primary"
                    size="small"
                    className="p-2"
                  >
                    <Edit size={16} />
                  </ButtonCard>
                  <ButtonCard
                    onClick={() => handleDeleteClick(difficulty.id)}
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
        title="Delete Difficulty Level"
        message="Are you sure you want to delete this difficulty level? This action cannot be undone."
        confirmText="Delete"
      />
    </div>
  );
};

export default DifficultyPage;