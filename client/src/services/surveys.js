import api from "./api";

export const createSurvey = (surveyData) => api.post("/surveys", surveyData);
export const updateSurvey = (surveyId, surveyData) => api.put(`/surveys/${surveyId}`, surveyData);
export const deleteSurvey = (surveyId) => api.delete(`/surveys/${surveyId}`);
export const getSurveysByUserId = (userId) => api.get(`/surveys/user/${userId}`);
export const getSurveyById = (surveyId) => api.get(`/surveys/${surveyId}`);

export const getPublicSurveys = () => api.get("/surveys/public");
export const getSurveyByPinCode = (pinCode) => api.get(`/surveys/pinCode/${pinCode}`);

export const getAllSurveys = () => api.get("/surveys");
