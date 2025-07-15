import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState({});

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      role: '', // dropdown
      password: '',
      password_confirmation: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid email').required('Email is required'),
      role: Yup.string().oneOf(['admin', 'user']).required('Role is required'),
      password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
      password_confirmation: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Password confirmation is required'),
    }),
    onSubmit: async (values) => {
      try {
        setServerError({});
        const data = await register(values);

        if (data.user.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/user/dashboard');
        }
      } catch (err) {
        // Laravel validation error handling
        if (err.response?.data?.errors) {
          setServerError(err.response.data.errors);
        } else {
          alert('Registration failed');
        }
      }
    },
  });

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded shadow">
      <h2 className="text-xl mb-4 font-bold">Register</h2>
      <form onSubmit={formik.handleSubmit} className="space-y-4">

        {/* Name */}
        <input
          name="name"
          placeholder="Name"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="w-full border px-3 py-2 rounded"
        />
        {formik.touched.name && formik.errors.name && <div className="text-red-500">{formik.errors.name}</div>}
        {serverError.name && <div className="text-red-500">{serverError.name[0]}</div>}

        {/* Email */}
        <input
          name="email"
          placeholder="Email"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="w-full border px-3 py-2 rounded"
        />
        {formik.touched.email && formik.errors.email && <div className="text-red-500">{formik.errors.email}</div>}
        {serverError.email && <div className="text-red-500">{serverError.email[0]}</div>}

        {/* Role Dropdown */}
        <select
          name="role"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">Select Role</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        {formik.touched.role && formik.errors.role && <div className="text-red-500">{formik.errors.role}</div>}
        {serverError.role && <div className="text-red-500">{serverError.role[0]}</div>}

        {/* Password */}
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="w-full border px-3 py-2 rounded"
        />
        {formik.touched.password && formik.errors.password && (
          <div className="text-red-500">{formik.errors.password}</div>
        )}
        {serverError.password && <div className="text-red-500">{serverError.password[0]}</div>}

        {/* Password Confirmation */}
        <input
          name="password_confirmation"
          type="password"
          placeholder="Confirm Password"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="w-full border px-3 py-2 rounded"
        />
        {formik.touched.password_confirmation && formik.errors.password_confirmation && (
          <div className="text-red-500">{formik.errors.password_confirmation}</div>
        )}

        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
