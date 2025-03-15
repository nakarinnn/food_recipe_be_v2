import express from "express";
import connectDB from "./db";
import cors from "cors";

import dotenv from "dotenv";
dotenv.config();

import os from 'os'
import ratingRoutes from "./routes/RatingRoutes";
import cookieParser from "cookie-parser";

const PORT = process.env.PORT || 6000;

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: ["http://localhost:5173"],
  credentials: true,
};

app.use(cors(corsOptions));

connectDB();

app.use("/api/rating", ratingRoutes);

app.get("/", (req, res) => {
  res.send("Hello, TypeScript with Node.js!");
});

app.get("/test/api", (req, res) => {
  res.json({
    message: "Welcome to Food Recipe API!",
    hostname: os.hostname(),
    port: PORT,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
