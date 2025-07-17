import { createContext, useContext, useState, useEffect } from 'react';
import axios from '../utils/axios';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 
  const login = async (email, password) => {
    try {      
      await axios.get('/sanctum/csrf-cookie');
      const res = await axios.post('/api/login', { email, password });
  
      // Update to success toast
      toast.update({
        render: 'Login successful!',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      });
      setUser(res.data.user);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.user.role);
      return res.data;
    } catch (error) {
      toast.dismiss(); 
      toast.error(
        error.response?.data?.message,
        { autoClose: 5000 }
      );

    }
  };

  const register = async (data) => {
    await axios.get('/sanctum/csrf-cookie');
    const res = await axios.post('/api/register', data);  
    console.log("✅ Registered user:", res.data.user);
    console.log("✅ Token received:", res.data.access_token);
    setUser(res.data.user);
    localStorage.setItem('token', res.data.access_token);
    localStorage.setItem('role', res.data.user.role);
    return res.data;
  };
  

  const logout = async () => {
    await axios.post('/api/logout');
    console.log("🚪 Logged out");

    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  };

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn("⚠️ No token found in localStorage");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get('/api/user');
        console.log("✅ User fetched from token:", res.data);
        setUser(res.data);
      } catch (e) {
        console.error("❌ Error fetching user with token:", e);
        setUser(null);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
