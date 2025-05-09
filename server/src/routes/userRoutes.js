import express from "express";
import authMiddleware from "../middleware/auth";
import { registerUser, loginUser, updateUser, getAllUsers, deleteUser } from "../controllers/userController";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/:id", authMiddleware, updateUser);

// ADMIN ROUTES
router.get("/", authMiddleware, getAllUsers);
router.delete("/:id", authMiddleware, deleteUser);

export default router;
