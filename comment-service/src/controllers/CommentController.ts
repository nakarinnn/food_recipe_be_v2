import { Request, Response } from "express";
import * as CommentService from "../services/CommentService";

export const createComment = async (req: any, res: Response) => {
  const { userId } = req.user;
  const {foodId, text} = req.body
  try {
    const comment = await CommentService.createComment(foodId, userId, text);
    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

export const getCommentsByFoodId = async (req: Request, res: Response) => {
  try {
    const comments = await CommentService.getCommentsByFoodId(req.params.foodId);
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const editComment = async (req: Request, res: Response) => {
  const {commentId} = req.params
  const {text} = req.body
  try {
    const comment = await CommentService.editComment(commentId, text);
    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  const {commentId} = req.params
  try {
    const comment = await CommentService.deleteComment(commentId);
    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ error: error });
  }
};