import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000/api', // change if your backend URL is different
});

// Automatically attach token
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
