import express from "express";
import {
	createSurvey,
	updateSurvey,
	deleteSurvey,
	getAllSurveys,
	getSurveysByUserId,
	getSurveyById,
} from "../controllers/surveyController.js";

const router = express.Router();

router.post("/", createSurvey);
router.put("/:id", updateSurvey);
router.delete("/:id", deleteSurvey);

router.get("/", getAllSurveys);
router.get("/user/:userId", getSurveysByUserId);
router.get("/:id", getSurveyById);

export default router;
