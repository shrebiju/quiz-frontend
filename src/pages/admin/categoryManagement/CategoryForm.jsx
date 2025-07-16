import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Plus, Edit } from 'lucide-react';
import ButtonCard from '../../../components/ButtonCard';

const CategoryForm = ({ editId, categoryToEdit, onSubmit, isSubmitting }) => {
  const formik = useFormik({
    initialValues: {
      name: categoryToEdit?.name || '',
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required('Category name is required')
        .min(3, 'Must be at least 3 characters')
        .max(50, 'Must be 50 characters or less'),
    }),
    onSubmit: (values) => onSubmit(values),
  });

  return (
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
    </form>
  );
};

export default CategoryForm;