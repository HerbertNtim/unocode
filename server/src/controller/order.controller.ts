import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import userModel from "../models/user.model";
import CourseModel from "../models/course.model";
import { getAllOrderService, newOrder } from "../services/order.service";
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendMail";
import notificationModel from "../models/notification.model";

// create order
export const createOrder = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId, payment_info } = req.body;
      const user = await userModel.findById(req.user?._id);

      const courseExistInUser = user?.courses.some(
        (item: any) => item._id.toString() === courseId
      );
      if (!courseExistInUser) {
        return next(new ErrorHandler("Course is already purchased", 400));
      }

      const course = await CourseModel.findById(courseId);
      if (!course) return next(new ErrorHandler("Course not found", 400));

      const data: any = {
        courseId: course._id,
        userId: user?._id,
        payment_info,
      };

      // create mail
      const mailData = {
        order: {
          _id: course.id.toString().slice(0, 6),
          name: course.name,
          price: course.price,
          date: new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        },
      };

      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/order-confirmation.ejs"),
        { order: mailData }
      );

      try {
        if (user) {
          await sendMail({
            email: user.email,
            subject: "Order Confirmation",
            template: "order-confirmation.ejs",
            data: mailData,
          });
        }
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
      }

      user?.courses.push(course.id);
      await user?.save();

      await notificationModel.create({
        user: user?._id,
        title: "New Order",
        message: "You have a new Order",
      });

      if(course.purchased){
        course.purchased = true;
      }

      await course.save();

      // create new order
      newOrder(data, res, next);
    } catch (error: any) {
      console.log("Error in the create order controller");
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// // Get all users ---only for admins
export const getAllOrders = CatchAsyncError(async(res: Response, next: NextFunction) => {
  try {
    getAllOrderService(res);
  } catch (error: any) {
    console.log("Error in the order controller getAllOrders");
    return next(new ErrorHandler(error.message, 500))
  }
});
