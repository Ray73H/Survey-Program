import express from "express";
import { authMiddleware, authOptional } from "../middleware/auth.js";
import {
	createAnswer,
	getAnswer,
	getAnswersBySurveyId,
	updateAnswer,
	getCompletedSurveyAnswers,
    getSavedSurveyAnswers,
    getThreeUncompletedSurveyAnswers,
	getResponseStatsByUser,
	getAllAnswers,
	calculateSurveyMetrics,
	getAnswerMetricsPerSurvey,
	getAnswerMetricsPerQuestion,
	getTotalResponses,
	getAverageCompletionRate,
	getAverageCompletionTime,
	getAverageUsersPerSurvey,
} from "../controllers/answerController.js";

const router = express.Router();
router.get('/total-responses', authMiddleware, getTotalResponses);
router.get('/average-completion-rate', authMiddleware, getAverageCompletionRate);
router.get('/average-completion-time', authMiddleware, getAverageCompletionTime);
router.get('/average-users-per-survey', authMiddleware, getAverageUsersPerSurvey);
router.get("/responseStats", getResponseStatsByUser);
router.get("/metrics-per-question", getAnswerMetricsPerQuestion);
router.get('/metrics-per-survey', getAnswerMetricsPerSurvey);
router.get('/stats', calculateSurveyMetrics);
router.get("/get_answers", getAllAnswers);
router.post("/", createAnswer);
router.put("/:id", updateAnswer);
router.get("/", getAnswer);
router.get("/completed", getCompletedSurveyAnswers);
router.get("/saved", getSavedSurveyAnswers);
router.get("/three", getThreeUncompletedSurveyAnswers);

// Experimenter
router.get("/survey/:surveyId", getAnswersBySurveyId);

export default router;
