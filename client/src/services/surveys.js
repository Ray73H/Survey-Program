import api from "./api";

export const createSurvey = (surveyData) => api.post("/surveys", surveyData);