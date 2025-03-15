import express from "express";
import * as CommentController from "../controllers/CommentController";
import { verifyToken } from "../Middleware/AuthToken";

const router = express.Router();

router.post("/", verifyToken, CommentController.createComment);
router.get("/:foodId", CommentController.getCommentsByFoodId);
router.put("/:commentId", verifyToken, CommentController.editComment);
router.delete("/:commentId", verifyToken, CommentController.deleteComment);

export default router;
