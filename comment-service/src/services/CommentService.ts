import mongoose from "mongoose";
import Comment from "../models/commentModel";
import redis from "../redis";

const CACHE_EXPIRY = 10 * 60;

export const createComment = async (foodId: string, userId: string, text: string) => {
  await redis.del(`commentsByFoodId:${foodId}`);

  const newComment = await Comment.create({ foodId, userId, text });
  return newComment;
};

export const getCommentsByFoodId = async (foodId: string) => {
  const cacheKey = `commentsByFoodId:${foodId}`;

  const cachedComments = await redis.get(cacheKey);
  if (cachedComments) {
    return JSON.parse(cachedComments);
  }

  const comments = await Comment.aggregate([
    {
      $match: { foodId: new mongoose.Types.ObjectId(foodId) },
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "userDetails",
      },
    },
    {
      $unwind: "$userDetails",
    },
    {
      $sort: { createdAt: -1 },
    },
  ]);

  await redis.set(cacheKey, JSON.stringify(comments), { EX: CACHE_EXPIRY });

  return comments;
};

export const editComment = async (commentId: string, text: string) => {
  const comment = await Comment.findByIdAndUpdate(commentId, { text }, { new: true });

  if (comment) {
    await redis.del(`commentsByFoodId:${comment.foodId}`);
  }

  return comment;
};

export const deleteComment = async (commentId: string) => {
  const comment = await Comment.findByIdAndDelete(commentId);

  if (comment) {
    await redis.del(`commentsByFoodId:${comment.foodId}`);
  }

  return comment;
};
