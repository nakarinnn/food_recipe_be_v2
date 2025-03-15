import { Request, Response } from "express";
import * as LikeService from "../services/LikeService";

export const likeItem = async (req: any, res: Response) => {
    const { userId } = req.user;
    const { targetId, targetType } = req.body;
    try {
        const like = await LikeService.likeItem(userId, targetId, targetType);
        res.status(201).json(like);
    } catch (error) {
        res.status(400).json({ error: error });
    }
};

export const getUserLikes = async (req: any, res: Response) => {
    const { userId } = req.user;
    try {
        const likedRecipes = await LikeService.getUserLikes(userId);
        res.status(200).json({ likedRecipes: likedRecipes.map((like: { targetId: any; }) => like.targetId) });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getFavoriteMenu = async (req: any, res: Response) => {
    const { userId } = req.user;
    try {
        const favoriteMenu = await LikeService.getFavoriteMenu(userId);
        res.status(200).json(favoriteMenu);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

