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
//     started,           (Needs to be set to true when starting survey from welcome page)
//     completed,
//     startedAt: Date,   (Needs to be sent when starting survey from welcome page)
//     completedAt,
// }
export const updateAnswer = (answerId, answerData) =>
    api.put(`/answers/${answerId}`, answerData, { public: true });
export const getAnswer = (surveyId, userId) =>
    api.get(`/answers?surveyId=${surveyId}&userId=${userId}`, { public: true });
export const getCompletedSurveyAnswers = (userId) =>
    api.get(`/answers/completed?userId=${userId}`, { public: true });
export const getSavedSurveyAnswers = (userId) =>
    api.get(`/answers/saved?userId=${userId}`, { public: true });
export const getThreeUncompletedSurveyAnswers = (userId) =>
    api.get(`/answers/three?userId=${userId}`, { public: true });

//Experimenter function
export const getAnswersBySurveyId = (surveyId) => api.post(`/answers/survey/${surveyId}`);
