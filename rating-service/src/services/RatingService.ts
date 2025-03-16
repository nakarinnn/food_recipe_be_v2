import Rating from "../models/ratingModel";
import Food from "../models/foodModel";
import redis from "../redis";

const CACHE_EXPIRY = 10 * 60;

export const createRating = async (foodId: string, userId: string, rating: number) => {
  try {
    const cacheKey = `foodRatings:${foodId}`;
    const averageCacheKey = `averageRating:${foodId}`;
    const cacheKeyfoodRatings = `foodRatings:${foodId}:${userId}`;

    await redis.del(cacheKey);
    await redis.del(averageCacheKey);
    await redis.del(cacheKeyfoodRatings);

    await redis.del("allFoods");
    await redis.del(`foodsByType:main-dish`);
    await redis.del(`foodsByType:dessert`);
    await redis.del(`foodsByType:drink`);
    await redis.del(`favoriteMenu:${userId}`);


    const existingRating = await Rating.findOne({ foodId, userId });

    if (!existingRating) {
      const newRating = await Rating.create({ foodId, userId, rating });

      await Food.findByIdAndUpdate(
        foodId,
        { $push: { ratings: newRating._id } },
        { new: true }
      );

      return { newRating, message: "Rating successful" };
    } else {
      const newRating = await Rating.findOneAndUpdate(
        { foodId, userId },
        { $set: { rating } },
        { new: true }
      );

      return { newRating, message: "Rating updated successfully" };
    }
  } catch (error) {
    console.error("Error in createRating:", error);
    return { error: "An error occurred while processing the rating" };
  }
};

export const getRatingsByFoodIdAndUserId = async (userId: string, foodId: string) => {
  const cacheKey = `foodRatings:${foodId}:${userId}`;

  const cachedRating = await redis.get(cacheKey);
  if (cachedRating) {
    return JSON.parse(cachedRating);
  }

  const rating = await Rating.findOne({ userId, foodId });

  if (rating) {
    await redis.set(cacheKey, JSON.stringify(rating), { EX: CACHE_EXPIRY });
  }

  return rating;
};

export const getAverageRating = async (foodId: string) => {
  const averageCacheKey = `averageRating:${foodId}`;

  const cachedAverage = await redis.get(averageCacheKey);
  if (cachedAverage) {
    return parseFloat(cachedAverage);
  }

  const ratings = await Rating.find({ foodId });

  if (ratings.length === 0) return 0;

  const average = ratings.reduce((sum, r: any) => sum + r.rating, 0) / ratings.length;

  await redis.set(averageCacheKey, average.toString(), { EX: CACHE_EXPIRY });

  return average;
};
