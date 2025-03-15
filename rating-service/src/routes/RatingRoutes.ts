import express from "express";
import * as RatingController from "../controllers/RatingController";
import { verifyToken } from "../Middleware/AuthToken";

const router = express.Router();

router.post("/", verifyToken, RatingController.createRating);
router.post("/get-rating", verifyToken, RatingController.getRatingsByFoodIdAnduserId);
router.post("/average-rating", RatingController.getAverageRating);

export default router;
