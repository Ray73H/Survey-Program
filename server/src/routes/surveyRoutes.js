import express from "express";
import {
	createSurvey,
	updateSurvey,
	deleteSurvey,
	getAllSurveys,
	getSurveysByUserId,
	getSurveyById,
	getPublicSurveys,
	getSurveyByPinCode,
	getThreeSurveys,
	importSurvey,
} from "../controllers/surveyController.js";
import { authMiddleware, authOptional } from "../middleware/auth.js";

const router = express.Router();

// EXPERIMENTEE ROUTES
router.get("/public", getPublicSurveys);
router.get("/pinCode/:pinCode", authOptional, getSurveyByPinCode);

// EXPERIMENTER ROUTES
router.post("/", authMiddleware, createSurvey);
router.put("/:id", authMiddleware, updateSurvey);
router.delete("/:id", authMiddleware, deleteSurvey);
router.get("/user/:userId", authMiddleware, getSurveysByUserId);
router.get("/three/user/:userId", authMiddleware, getThreeSurveys);
router.get("/:id", authMiddleware, getSurveyById);
router.post("/import", authMiddleware, importSurvey);

// ADMIN ROUTES
router.get("/", authMiddleware, getAllSurveys);

export default router;
