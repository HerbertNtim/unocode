import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URL: string = process.env.MONGO_URL || "";
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URL).then((data: any) => {
      console.log("MongoDB connected");
    }) 
  } catch (error) {
    console.error("MongoDB connection failed");
    setTimeout(connectDB, 5000);
  }
}

export default connectDB;
