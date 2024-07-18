import mongoose, { Model } from "mongoose";

export interface IOrder extends mongoose.Document{
  courseId: string;
  userId: string;
  payment_info: object;
}

const orderSchema = new mongoose.Schema<IOrder> ({
  courseId: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  payment_info: {
    type: Object
  }
}, {timestamps: true});


const orderModel: Model<IOrder> = mongoose.model("Order", orderSchema)

export default orderModel;
