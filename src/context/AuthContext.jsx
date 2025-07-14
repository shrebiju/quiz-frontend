import { createContext, useContext, useState, useEffect } from 'react';
import axios from '../utils/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // const login = async (email, password) => {
  //   await axios.get('/sanctum/csrf-cookie'); 
  //   const res = await axios.post('/login', { email, password });
  //   // console.log(res,"resposne");
  //   setUser(res.data.user);
  // };
  const login = async (email, password) => {
    await axios.get('/sanctum/csrf-cookie'); // Must call this first
    const res = await axios.post('/api/login', { email, password });
    return res.data;
  };
  // const login = async (email, password) => {
  //   await axios.get('/sanctum/csrf-cookie');
  //   const res = await axios.post('/login', { email, password });
  //   setUser(res.data.user);
  //   localStorage.setItem("role", res.data.user.role); // optional
  // };
  

  const register = async (data) => {
    await axios.get('/sanctum/csrf-cookie');
    const res = await axios.post('/register', data);
    setUser(res.data.user);
  };

  const logout = async () => {
    await axios.post('/logout');
    setUser(null);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('/user');
        setUser(res.data);
      } catch (e) {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
