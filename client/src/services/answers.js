import api from "./api";

// createAnswer:
// answerData = {
//     surveyId,
//     respondentType,   ("user" or "guest")
//     respondentId,     (only include if respondentType="user")
//     guestId,          (only include if respondentType="guest")
// }

export const getResponseStatsByUser = () => api.get("/answers/responseStats");

export const getMetricsPerQuestion = () => api.get('answers/metrics-per-question');

export const getMetricsPerSurvey = () => api.get('answers/metrics-per-survey');

export const fetchAnswerMetrics = () => api.get('/answers/metrics');

export const getSurveyMetrics = () => api.get('answers/stats');

export const getAllAnswers = () => api.get("/answers/get_answers");

export const createAnswer = (answerData) => api.post("/answers", answerData, { public: true });

export const getTotalResponses = () => api.get('answers/total-responses');
export const getAverageCompletionRate = () => api.get('answers/average-completion-rate');
export const getAverageCompletionTime = () => api.get('answers/average-completion-time');
export const getAverageUsersPerSurvey = () => api.get('answers/average-users-per-survey');

// updatedAnswer:
// answerData = {
//     surveyId,
//     respondentType,    ("user" or "guest")
//     respondentId,      (only include if respondentType="user")
//     guestId,           (only include if respondentType="guest")
//     answers,
//     started,           (Needs to be set to true when starting survey from welcome page)
//     completed,
//     startedAt: Date,   (Needs to be sent when starting survey from welcome page)
//     completedAt,
// }
export const updateAnswer = (answerId, answerData) =>
    api.put(`/answers/${answerId}`, answerData, { public: true });

// For all get functions, you can just set the guest parameter to: !!user?.guest
// (userId should still be user.userId from context)
export const getAnswer = (surveyId, guest, userId) =>
    api.get(`/answers?surveyId=${surveyId}&guest=${guest}&userId=${userId}`, { public: true });
export const getCompletedSurveyAnswers = (guest, userId) =>
    api.get(`/answers/completed?guest=${guest}&userId=${userId}`, { public: true });
export const getSavedSurveyAnswers = (guest, userId) =>
    api.get(`/answers/saved?guest=${guest}&userId=${userId}`, { public: true });
export const getThreeUncompletedSurveyAnswers = (guest, userId) =>
    api.get(`/answers/three?guest=${guest}&userId=${userId}`, { public: true });

//Experimenter function
export const getAnswersBySurveyId = (surveyId) => api.post(`/answers/survey/${surveyId}`);
