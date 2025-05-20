import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import {
	registerUser,
	loginUser,
	updateUser,
	getAllUsers,
	deleteUser,
	addSurveyAccess,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/:id", authMiddleware, updateUser);

// ADMIN ROUTES
router.get("/", getAllUsers);
router.delete("/:id", authMiddleware, deleteUser);

router.post("/:id/surveyAccess", authMiddleware, addSurveyAccess);

export default router;
