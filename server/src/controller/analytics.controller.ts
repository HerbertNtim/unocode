import { Response, Request, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import { generateLast12MonthsData } from "../utils/analytics-generator";
import userModel from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import CourseModel from "../models/course.model";
import orderModel from "../models/order.model";

// Get user analytics --- only for admins
export const getUserAnalytics = CatchAsyncError(
  async (res: Response, req: Request, next: NextFunction) => {
    try {
      const user = await generateLast12MonthsData(userModel);

      res.json({
        success: true,
        user,
      });
    } catch (error: any) {
      console.log("Error in the analytics controller getUserAnalytics");
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Get courses analytics --- only for admins
export const getCourseAnalytics = CatchAsyncError(
  async (res: Response, req: Request, next: NextFunction) => {
    try {
      const course = await generateLast12MonthsData(CourseModel);

      res.json({
        success: true,
        course,
      });
    } catch (error: any) {
      console.log("Error in the analytics controller getCourseAnalytics");
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Get user analytics --- only for admins
export const getOrderAnalytics = CatchAsyncError(
  async (res: Response, req: Request, next: NextFunction) => {
    try {
      const order = await generateLast12MonthsData(orderModel);

      res.json({
        success: true,
        order,
      });
    } catch (error: any) {
      console.log("Error in the analytics controller getOrderAnalytics");
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

