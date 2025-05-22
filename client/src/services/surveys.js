import api from "./api";

export const createSurvey = (surveyData) => api.post("/surveys", surveyData); // surveyData only needs userId and author fields
export const updateSurvey = (surveyId, surveyData) => api.put(`/surveys/${surveyId}`, surveyData);
export const deleteSurvey = (surveyId) => api.delete(`/surveys/${surveyId}`);

// Get Functions
export const getSurveysByUserId = (userId) => api.get(`/surveys/user/${userId}`);
export const getUnpublishedSurveys = (userId) => api.get(`/surveys/unpublished/user/${userId}`);
export const getOngoingSurveys = (userId) => api.get(`/surveys/ongoing/user/${userId}`);
export const getSurveyById = (surveyId) => api.get(`/surveys/${surveyId}`);
export const getPublicSurveys = () => api.get("/surveys/public", { public: true });
export const getSurveyByPinCode = (pinCode) =>
    api.get(`/surveys/pinCode/${pinCode}`, { public: true });
export const getAllSurveys = () => api.get("/surveys");

// Import and Export Functions
export const exportSurvey = async (surveyId) => {
    const response = await getSurveyById(surveyId);
    const { title, description, questions, author } = response.data;
    const exportData = {
        title,
        description,
        questions,
        author,
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Survey - ${title}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

export const importSurvey = async (userId, file) => {
    try {
        const text = await file.text();
        const surveyData = JSON.parse(text);

        if (!surveyData.title || !surveyData.questions || !surveyData.author) {
            throw new Error("Invalid survey format: missing required fields");
        }

        return await api.post(`/surveys/import`, { ...surveyData, userId });
    } catch (error) {
        throw new Error("Failed to import survey: " + error.message);
    }
};
