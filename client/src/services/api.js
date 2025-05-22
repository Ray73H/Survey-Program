import axios from "axios";
import { useNavigate } from "react-router-dom";

const api = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        if (config.public) {
            return config;
        }

        const token = sessionStorage.getItem("authToken");
        if (!token) {
            return Promise.reject("No token found");
        }
        config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error),
);

api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response && err.response.status === 401) {
            console.error("[API Error]", err.response?.data || err.message);
        }
        return Promise.reject(err);
    },
);

export default api;
