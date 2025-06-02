import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import {
	registerUser,
	loginUser,
	updateUser,
	getAllUsers,
	deleteUser,
	getUser,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// ADMIN ROUTES
router.get("/all", getAllUsers);

router.put("/:id", authMiddleware, updateUser);
router.get("/:id", authMiddleware, getUser);
router.delete("/:id", authMiddleware, deleteUser);




export default router;
