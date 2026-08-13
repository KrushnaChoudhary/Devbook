import express from "express";

import protect from "../middleware/authMiddleware.js";

import {
  getCurrentUser,
  updateProfile,
  toggleFollowUser,
  getUserProfile,
  searchUsers,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/me", protect, getCurrentUser);

router.get("/search", searchUsers);

router.get("/:id", getUserProfile);

router.put("/profile", protect, updateProfile);

router.put("/:id/follow", protect, toggleFollowUser);

export default router;