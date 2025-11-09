import axios from 'axios';

// Defina a URL base do seu backend Spring Boot
// (ajuste se a porta for diferente)
const api = axios.create({
  baseURL: 'http://localhost:8080', 
});

// Se o sistema precisar usar token JWT depois do login:
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
