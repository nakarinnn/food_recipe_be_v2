import Food from "../models/foodModel";
import Like from "../models/likeModel";
import Rating from "../models/ratingModel";
import Comment from "../models/commentModel";
import mongoose from "mongoose";
import redis from "../redis";

const CACHE_EXPIRE_TIME = 10 * 60;

export const createFood = async (foodData: any, userId: string) => {
  const newFood = await Food.create({
    name: foodData.name,
    category: foodData.category,
    description: foodData.description,
    cookTime: foodData.cookTime,
    image: foodData.image,
    owner: foodData.owner,
    ingredients: foodData.ingredients,
    instructions: foodData.instructions,
    ratings: foodData.ratings,
    comments: foodData.comments
  });

  const categoryMap: Record<string, string> = {
    "อาหารคาว": "main-dish",
    "อาหารหวาน": "dessert",
    "เครื่องดื่ม": "drink",
  };

  await redis.del("allFoods");
  await redis.del(`foodsByType:${categoryMap[foodData.category]}`);
  await redis.del(`foodsByUser:${userId}`);
  return newFood;
};

export const getAllFoods = async () => {
  const cacheKey = "allFoods";
  const cachedFoods = await redis.get(cacheKey);

  if (cachedFoods) {
    return JSON.parse(cachedFoods);
  }

  const foods = await Food.find().populate("ratings").populate("comments").lean();

  const foodsWithAvg = foods.map((food) => ({
    ...food,
    avg: food.ratings.length
      ? food.ratings.reduce((sum, r: any) => sum + r.rating, 0) / food.ratings.length
      : 0,
  }));

  await redis.set(cacheKey, JSON.stringify(foodsWithAvg), {
    EX: CACHE_EXPIRE_TIME,
  });

  return foodsWithAvg;
};

export const getFoodsRandom = async () => {
  const foods = await Food.find().populate("ratings").populate("comments").limit(12).lean();

  const foodsWithAvg = foods.map((food) => ({
    ...food,
    avg: food.ratings.length
      ? food.ratings.reduce((sum, r: any) => sum + r.rating, 0) / food.ratings.length
      : 0,
  }));

  return foodsWithAvg;
};

export const getFoodById = async (id: string) => {
  const cacheKey = `food:${id}`;
  const cachedFood = await redis.get(cacheKey);

  if (cachedFood) {
    return JSON.parse(cachedFood);
  }

  try {
    const food = await Food.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(id) }
      },
      {
        $lookup: {
          from: 'users',                  
          localField: 'owner',                
          foreignField: '_id',               
          as: 'ownerDetails'                 
        }
      },
      {
        $unwind: '$ownerDetails'          
      },
    ]);

    await redis.set(cacheKey, JSON.stringify(food), {
      EX: CACHE_EXPIRE_TIME,
    });

    return food;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const getFoodByUserId = async (userId: string) => {
  const cacheKey = `foodsByUser:${userId}`;
  const cachedFoods = await redis.get(cacheKey);

  if (cachedFoods) {
    return JSON.parse(cachedFoods);
  }

  const foods = await Food.find({ owner: userId }).populate("ratings").populate("comments").sort({ createdAt: -1 }).lean();

  const foodsWithAvg = foods.map((food) => ({
    ...food,
    avg: food.ratings.length
      ? food.ratings.reduce((sum, r: any) => sum + r.rating, 0) / food.ratings.length
      : 0,
  }));

  await redis.set(cacheKey, JSON.stringify(foodsWithAvg), {
    EX: CACHE_EXPIRE_TIME,
  });

  return foodsWithAvg;
};

export const getFoodsByType = async (type: string) => {
  const cacheKey = `foodsByType:${type}`;
  const cachedFoods = await redis.get(cacheKey);

  if (cachedFoods) {
    return JSON.parse(cachedFoods);
  }

  try {
    const categoryMap: Record<string, string> = {
      "main-dish": "อาหารคาว",
      "dessert": "อาหารหวาน",
      "drink": "เครื่องดื่ม",
    };

    const category = categoryMap[type];
    if (!category) return [];

    const foods = await Food.find({ category }).populate("ratings").sort({ createdAt: -1 }).lean();

    const foodsWithAvg = foods.map((food) => ({
      ...food,
      avg: food.ratings.length
        ? food.ratings.reduce((sum, r: any) => sum + r.rating, 0) / food.ratings.length
        : 0,
    }));

    await redis.set(cacheKey, JSON.stringify(foodsWithAvg), {
      EX: CACHE_EXPIRE_TIME,
    });

    return foodsWithAvg;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const searchFood = async (query: string) => {
  const foods = await Food.find({
    name: { $regex: query, $options: 'i' },
  }).populate("ratings").lean();

  const foodsWithAvg = foods.map((food) => ({
    ...food,
    avg: food.ratings.length
      ? food.ratings.reduce((sum, r: any) => sum + r.rating, 0) / food.ratings.length
      : 0,
  }));

  return foodsWithAvg;
};

export const deleteRecipe = async (recipeId: string, userId: string) => {
  await Like.deleteMany({ targetId: recipeId });
  await Rating.deleteMany({ foodId: recipeId });
  await Comment.deleteMany({ foodId: recipeId });

  const deletedFood = await Food.findByIdAndDelete({ _id: recipeId });

  if (!deletedFood) {
    throw new Error("เมนูที่ต้องการลบไม่มีอยู่ในระบบ");
  }

  await redis.del("allFoods");
  await redis.del(`food:${recipeId}`);
  await redis.del(`foodsByUser:${userId}`);
  await redis.del("foodsByType:main-dish");
  await redis.del("foodsByType:dessert");
  await redis.del("foodsByType:drink");
  await redis.del(`favoriteMenu:${userId}`);
  
  return deletedFood;
};
