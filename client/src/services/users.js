import api from "./api";

export const registerUser = (userData) => api.post("/users/register", userData, { public: true });
export const loginUser = (userData) => api.post("/users/login", userData, { public: true });
export const updateUser = (userId, userData) => api.put(`/users/${userId}`, userData);
export const getUser = (userId) => api.get(`/users/${userId}`);
export const deleteUser = (userId) => api.delete(`/users/${userId}`);

export const getAllUsers = () => api.get("/users/all");
export const addSurveyAccess = (userId, surveyId) =>
  api.put(`/users/${userId}/surveyAccess`, { surveyId });
