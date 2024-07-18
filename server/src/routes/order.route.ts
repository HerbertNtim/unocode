import express from "express";
import { createOrder, getAllOrders } from "../controller/order.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";

const orderRouter = express.Router();

orderRouter.post("/create-order", createOrder);

orderRouter.get(
  "/get-all-order",
  isAuthenticated,
  authorizeRoles("admin"),
  getAllOrders
);

export default orderRouter;
