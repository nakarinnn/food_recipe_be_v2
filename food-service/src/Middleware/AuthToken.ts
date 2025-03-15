import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

interface CustomRequest extends Request {
  user?: any;
}

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

export const verifyToken = (req: CustomRequest, res: any, next: any) => {
  const token = req.cookies.authToken;
  if (!token) 
    return res.status(401).json({ message: "Unauthorized" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid Token" });
  }
};