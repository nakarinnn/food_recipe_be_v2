import express from "express";
import * as likeController from "../controllers/likeController";
import { verifyToken } from "../Middleware/AuthToken";

const router = express.Router();

router.post("/", verifyToken, likeController.likeItem);
router.get("/", verifyToken, likeController.getUserLikes);
router.get("/favoriteMenu", verifyToken, likeController.getFavoriteMenu)

export default router;
