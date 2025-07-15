import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true, // We're using token, not cookie sessions
});

// Attach token if available
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("🔐 Token added to request:", token);
    } else {
      console.warn("⚠️ No token in request");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
