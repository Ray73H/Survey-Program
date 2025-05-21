import express from "express";
import { authMiddleware, authOptional } from "../middleware/auth.js";
import { createAnswer, getAnswer, getAnswersBySurveyId, updateAnswer } from "../controllers/answerController.js";

const router = express.Router();

router.post("/", createAnswer);
router.put("/:id", updateAnswer);
router.get("/", getAnswer);
router.get("/survey/:surveyId", getAnswersBySurveyId);

export default router;
