import { Request, Response } from "express";
import { createUser, getAllUsers, loginUser } from "../services/userService";

export const createUserController = async (req: Request, res: Response) => {
  const { name, email, password, avatar_url } = req.body;
  try {
    const user = await createUser(name, email, password, avatar_url);
    res.status(201).json(user);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Error creating user", error });
    }
  }
};


export const loginController = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const { user, token } = await loginUser(email, password);

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV == 'production',
      sameSite: 'strict',
      // maxAge: 7 * 24 * 60 * 60 * 1000, // อายุ cookie 7 วัน
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Login successful", user: { id: user._id, name: user.name, email: user.email, avatar_url: user.avatar_url } });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "Login failed", error });
    }
  }
};

export const getUsersController = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};


export const logoutController = async (req: Request, res: any) => {
  try {
    res.clearCookie('authToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV == 'production',
      sameSite: 'None'
    });
    return res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'เกิดข้อผิดพลาดระหว่างการออกจากระบบ', error });
  }
};