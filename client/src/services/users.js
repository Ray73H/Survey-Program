import api from "./api";

export const registerUser = (userData) => api.post("/users/register", userData, { public: true });
export const loginUser = (userData) => api.post("/users/login", userData, { public: true });
export const updateUser = (userId, userData) => api.put(`/users/${userId}`, userData);

export const getAllUsers = () => api.get("/users");
export const deleteUser = (userId) => api.delete(`/users/${userId}`);
