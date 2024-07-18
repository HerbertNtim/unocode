import express from "express";
import { getAllNotification, updateNotification } from "../controller/notification.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";

const notificationRouter = express.Router();

notificationRouter.get(
  "/get-all-notifications",
  isAuthenticated,
  authorizeRoles("admin"),
  getAllNotification
);

notificationRouter.put(
  "/update-notification/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  updateNotification
);

export default notificationRouter;
