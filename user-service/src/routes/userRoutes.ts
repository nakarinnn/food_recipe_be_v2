import express from "express";
import * as userController from "../controllers/userController";
import { verifyToken } from "../Middleware/AuthToken";

const router = express.Router();

router.post("/register", userController.createUserController);
router.post("/login", userController.loginController);
router.post("/logout", verifyToken, userController.logoutController);
router.get("/getAllusers", userController.getUsersController);

export default router;
