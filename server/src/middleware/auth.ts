import jwt, { JwtPayload } from 'jsonwebtoken';
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "./catchAsyncError";
import { Request, Response, NextFunction } from "express";
import dotenv from 'dotenv'
import { redis } from '../utils/redis';

dotenv.config()

// authenticated user
export const isAuthenticated = CatchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
  const access_token = req.cookies.access_token as string;

  if(!access_token){
    return next(new ErrorHandler('Login to access this request', 400))
  }

  const decode = jwt.verify(access_token, process.env.ACCESS_TOKEN as string) as JwtPayload;
  if(!decode){
    return next(new ErrorHandler('Unable to verify your credentials', 402))
  }

  const user = await redis.get(decode.id)
  if(!user) {
    return next(new ErrorHandler('Login again', 401))
  }

  req.user = JSON.parse(user)

  next()
})


// Validate user role 
export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if(!roles.includes(req.user?.role || ' ')){
      return next(new ErrorHandler(`Role (${req.user?.role}) is not allowed to access this resource`, 403))
    }
    next()
  }
}
