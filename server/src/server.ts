import express, { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import connectDB from './utils/db';
import userRouter from './routes/user.route';
dotenv.config();
import { v2 as cloudinary } from 'cloudinary';
import courseRouter from './routes/course.route';
import orderRouter from './routes/order.route';
import notificationRouter from './routes/notification.route';
import analyticRouter from './routes/analytics.route';
import layoutRouter from './routes/layout.route';

const app = express();
app.use(express.json(
  { limit: '50mb' }
)); 

app.use(cookieParser());

app.use(cors(
  {
    origin: ['http://localhost:3000'],
    credentials: true
  }
)); // Enable CORS for all requests

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

// routes
app.use('/unocode/auth', userRouter);
app.use('/unocode/courses', courseRouter);
app.use('/unocode/order', orderRouter);
app.use('/unocode/notification', notificationRouter);
app.use('/unocode/analysis', analyticRouter);
app.use('/unocode/layout', layoutRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});


// unknown route handler
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err: any = new Error(`Can't find ${req.originalUrl} on this server!`);
  err.statusCode = 404;
  next(err);
});
