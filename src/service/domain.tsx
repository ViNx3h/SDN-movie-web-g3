import axios, { AxiosInstance, AxiosResponse } from "axios";

export const domain: AxiosInstance = axios.create({
  baseURL: "http://localhost:5000/api/auth",
  timeout: 10000, // Giới hạn thời gian request (10 giây)
  headers: {
    "Content-Type": "application/json",
  },
});

// Xử lý response
domain.interceptors.response.use(
  (response: AxiosResponse) => response, // Lấy trực tiếp data từ response
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error.response?.data || error.message);
  }
);
