import User from "../models/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import redis from "../redis";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;
const CACHE_EXPIRE_TIME = 7 * 24 * 60 * 60;

export const createUser = async (name: string, email: string, password: string, avatar_url: string) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('อีเมลนี้มีอยู่แล้ว');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ name, email, password: hashedPassword, avatar_url });
  await newUser.save();

  await redis.del("allUsers");

  return newUser;
};

export const loginUser = async (email: string, password: string) => {
  const cacheKey = `user:${email}`;
  
  const cachedUser = await redis.get(cacheKey);
  if (cachedUser) {
    return JSON.parse(cachedUser);
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("อีเมลหรือรหัสผ่านไม่ถูกต้อง โปรดลองอีกครั้ง");
  }

  const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: "1d" });

  const userToCache = {
    _id: user._id,
    name: user.name,
    email: user.email,
    avatar_url: user.avatar_url,
  };

  await redis.set(cacheKey, JSON.stringify(userToCache), {
    EX: CACHE_EXPIRE_TIME,
  });

  return { user: userToCache, token };
};


export const getAllUsers = async () => {
  const cacheKey = "allUsers";
  const cachedUsers = await redis.get(cacheKey);

  if (cachedUsers) {
    return JSON.parse(cachedUsers);
  }

  const users = await User.find();

  await redis.set(cacheKey, JSON.stringify(users), {
    EX: CACHE_EXPIRE_TIME,
  });

  return users;
};
