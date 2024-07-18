import { NextFunction, Response } from "express";
import { redis } from "../utils/redis";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import userModel from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";

// get user by id
export const getUserById = CatchAsyncError(
  async (id: string, res: Response) => {
    const userJson = await redis.get(id);

    if (userJson) {
      const user = JSON.parse(userJson);
      return res.status(200).json({
        success: true,
        user,
      });
    }
  }
);

// Get all users
export const getAllUsersService = async (res: Response, next: NextFunction) => {
  const users = await userModel.find().sort({ CreatedAt: -1 });

  if (!users) return next(new ErrorHandler("Users not found", 404));

  res.status(200).json({
    success: true,
    users,
  });
};

// updateUserRole
export const updateUserRoleService = async (
  id: string,
  role: string,
  res: Response,
  next: NextFunction
) => {
  const user = userModel.findById(id, { role }, { new: true });

  if (!user) return next(new ErrorHandler("User not found", 404));

  res.json({
    success: true,
    user,
  });
};
