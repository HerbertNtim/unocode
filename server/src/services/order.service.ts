import { Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import orderModel from "../models/order.model";


// Create new order 
export const newOrder = CatchAsyncError(async(data: any, res: Response) => {
  const order = await orderModel.create(data);

  res.status(201).json({
    success: true,
    order,
  });
})


// Get all orders
export const getAllOrderService = async (res: Response) => {
  const orders = await orderModel.find().sort({ CreatedAt: -1 });

  res.status(200).json({
    success: true,
    orders,
  });
};
