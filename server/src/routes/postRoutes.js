import express from "express";

import protect from "../middleware/authMiddleware.js";

// import { createPost } from "../controllers/postController.js";
import {
  createPost,
  getPosts,
  toggleLikePost,
  addComment,
  deletePost,
  getFeedPosts,
  toggleSavePost,
  getSavedPosts
} from "../controllers/postController.js";



const router = express.Router();

router.get("/", getPosts);

router.get("/feed", protect, getFeedPosts);

router.get("/saved", protect, getSavedPosts);

router.post("/", protect, createPost);

router.put("/:id/like", protect, toggleLikePost);

router.put("/:id/save", protect, toggleSavePost);

router.post("/:id/comment", protect, addComment);

router.delete("/:id", protect, deletePost);

export default router;
