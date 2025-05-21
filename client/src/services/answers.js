import api from "./api";

// createAnswer:
// answerData = {
//     surveyId,
//     respondentType,   ("user" or "guest")
//     respondentId,     (only include if respondentType="user")
// }
export const createAnswer = (answerData) => api.post("/answers", answerData, { public: true });

// updatedAnswer:
// answerData = {
//     surveyId,
//     respondentType,    ("user" or "guest")
//     respondentId,      (only include if respondentType="user")
//     answers,
//     completed,
//     completedAt,
// }
export const updateAnswer = (answerId, answerData) =>
    api.put(`/answers/${answerId}`, answerData, { public: true });
export const getAnswer = (surveyId, userId) =>
    api.get(`/answers?surveyId=${surveyId}&userId=${userId}`, { public: true });
export const getAnswersBySurveyId = (surveyId) => api.post(`/answers/survey/${surveyId}`);
