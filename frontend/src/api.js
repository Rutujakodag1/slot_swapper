import axios from "axios";

const API = axios.create({
  baseURL: "https://slot-swapper-backend-mcaw.onrender.com/api/users", // adjust path if needed
});

// ✅ Add Authorization token for every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
