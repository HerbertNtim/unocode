import { Response, NextFunction, Request } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import notificationModel from "../models/notification.model";
import cron from "node-cron";

// get all notification --- only admin
export const getAllNotification = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const notification = await notificationModel
        .find()
        .sort({ createdAt: -1 });

      res.status(201).json({
        success: true,
        notification,
      });
    } catch (error: any) {
      console.log("Error in the notification controller");
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// update notification status --- admin only
export const updateNotification = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const notification = await notificationModel.findById(req.params.id);
      if (!notification) {
        return next(new ErrorHandler("Notification not found", 500));
      } else {
        notification.status
          ? (notification.status = "read")
          : notification.status;
      }

      await notification.save();

      const notifications = await notificationModel
        .find()
        .sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        notifications,
      });
    } catch (error: any) {
      console.log("Error in the update notification controller");
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Delete Notification ---crone job
cron.schedule('0 0 0 * * *', async() => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const notification = await notificationModel.deleteMany({status: 'read', createdAt: {$lt: thirtyDaysAgo}});

  console.log('Notification deleted', notification.deletedCount)
});


