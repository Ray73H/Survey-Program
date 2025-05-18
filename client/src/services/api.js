import axios from "axios";
import { useNavigate } from "react-router-dom";

const handleLogout = () => {
    // sessionStorage.removeItem("authToken");
    // window.location.href = "/login";
};

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
            handleLogout();
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
            handleLogout();
        }
        console.error("[API Error]", err.response?.data || err.message);
        return Promise.reject(err);
    },
);

export default api;
