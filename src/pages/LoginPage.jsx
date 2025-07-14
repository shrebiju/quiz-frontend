import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email').required('Required'),
      password: Yup.string().required('Required'),
    }),
    onSubmit: async (values) => {
      try {
        await login(values.email, values.password);
    
        // After login, check role from context
        const role = localStorage.getItem("role"); // optional: if you want persistence
        if (role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/user/dashboard");
        }
      } catch (err) {
        alert("Login failed");
      }
    },
    
    // onSubmit: async (values) => {
    //   try {
    //     await login(values.email, values.password);
    //     navigate('/user/dashboard'); // or /admin/dashboard based on role
    //   } catch (err) {
    //     alert('Login failed');
    //   }
    // },
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

        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
