import { Request, Response } from "express";
import * as RatingService from "../services/RatingService";

export const createRating = async (req: any, res: Response) => {
  const { userId } = req.user;
  const { foodId, rating } = req.body
  try {
    const rate = await RatingService.createRating(foodId, userId, rating);
    res.status(201).json(rate);
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

export const getRatingsByFoodIdAnduserId = async (req: any, res: Response) => {
  const { userId } = req.user;
  const { foodId } = req.body
  try {
    const ratings = await RatingService.getRatingsByFoodIdAndUserId(userId, foodId);
    res.status(200).json(ratings);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const getAverageRating = async (req: Request, res: Response) => {
  const { foodId } = req.body
  try {
    const ratings = await RatingService.getAverageRating(foodId);
    res.status(200).json(ratings);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

