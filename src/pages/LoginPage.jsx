import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import ButtonCard from '../components/ButtonCard';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email').required('Required'),
      password: Yup.string().required('Required'),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const data = await login(values.email, values.password);
        if (data.user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/user/dashboard");
        }
        toast.success('Login successful!');
      } catch (err) {
        // toast.error(err.response?.data?.message || 'Login failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  });

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded shadow">
      <h2 className="text-xl mb-4 font-bold">Login</h2>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <input
          name="email"
          placeholder="Email"
          onChange={formik.handleChange}
          className="w-full border px-3 py-2 rounded"
        />
        {formik.touched.email && formik.errors.email && (
          <div className="text-red-500">{formik.errors.email}</div>
        )}

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={formik.handleChange}
          className="w-full border px-3 py-2 rounded"
        />
        {formik.touched.password && formik.errors.password && (
          <div className="text-red-500">{formik.errors.password}</div>
        )}

        <ButtonCard
          type="submit"
          color="primary"
          size="medium"
          loading={isLoading}
          fullWidth
        >
          Login
        </ButtonCard>
      </form>
    </div>
  );
};

export default LoginPage;