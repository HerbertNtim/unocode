import { Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import CourseModel from "../models/course.model";

// Create course
export const createCourse = CatchAsyncError(async(data: any, res: Response) => {
  const course = await CourseModel.create(data)
  res.status(201).json({
    success: true,
    course
  })
});

// Get all couses
export const getAllCoursesService = async (res: Response) => {
  const courses = await CourseModel.find().sort({ CreatedAt: -1 });

  res.status(200).json({
    success: true,
    courses,
  });
};
