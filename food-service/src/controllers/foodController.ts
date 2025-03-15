import { Request, Response } from "express";
import * as FoodService from "../services/FoodService";

export const createFood = async (req: any, res: Response) => {
  const { userId } = req.user
  try {
    const food = await FoodService.createFood(req.body.formData, userId);
    res.status(201).json(food);
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

export const getAllFoods = async (req: Request, res: Response) => {
  try {
    const foods = await FoodService.getAllFoods();
    res.status(200).json(foods);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const getFoodsRandom = async (req: Request, res: Response) => {
  try {
    const foods = await FoodService.getFoodsRandom();
    res.status(200).json(foods);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const getFoodByUserId = async (req: any, res: Response) => {
  const { userId } = req.user
  try {
    const foods = await FoodService.getFoodByUserId(userId);
    res.status(200).json(foods);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};


export const getFoodsByType = async (req: Request, res: Response) => {
  try {
    const foods = await FoodService.getFoodsByType(req.params.type);
    res.status(200).json(foods);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};


export const getFoodById = async (req: Request, res: Response) => {
  try {
    const food = await FoodService.getFoodById(req.params.foodId);
    res.status(200).json(food);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const searchFood = async (req: Request, res: Response) => {
  const { search } = req.params;
  try {
    const searchMenu = await FoodService.searchFood(search);
    res.status(200).json(searchMenu);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

export const deleteRecipe = async (req: any, res: Response) => {
  const { recipeId } = req.params
  const { userId } = req.user
  try {
    const comment = await FoodService.deleteRecipe(recipeId, userId);
    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ error: error });
  }
};
