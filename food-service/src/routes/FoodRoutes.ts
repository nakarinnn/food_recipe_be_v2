import express from "express";
import * as FoodController from "../controllers/foodController";
import { verifyToken } from "../Middleware/AuthToken";

const router = express.Router();

router.post("/add-recipe", verifyToken, FoodController.createFood);
router.get("/getAllfood", FoodController.getAllFoods);
router.get("/getFoodByUserId", verifyToken, FoodController.getFoodByUserId);
router.get("/food-random", FoodController.getFoodsRandom);
router.get("/:foodId", FoodController.getFoodById);
router.get("/foodtype/:type", FoodController.getFoodsByType)
router.get("/search/:search", FoodController.searchFood)
router.delete("/:recipeId", verifyToken, FoodController.deleteRecipe);

export default router;
