import express from "express";
import { loginUser, refreshToken, logoutUser, registerUser } from "@app/controllers/authController";

const router = express.Router();

// Auth routes
router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/refresh", refreshToken);
router.post("/logout", logoutUser);

export default router;