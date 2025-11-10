import axios from "axios";

export const API_BASE_URL = "http://localhost:8080";

// cria uma instância do axios com a URL base
const api = axios.create({
  baseURL: API_BASE_URL,
});

// adiciona o token JWT automaticamente (se existir)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
