import dotenv from 'dotenv'
import { Response } from 'express'
import { IUser } from '../models/user.model'
import { redis } from './redis'

dotenv.config()

interface ITokenOptions {
  expires: Date;
  maxAge: number;
  httpOnly: boolean;
  sameSite: 'lax' | 'strict' | 'none';
  secure?: boolean;
}

// parse environment variables to integrate with fallback values
const accessTokenExpires = parseInt(process.env.ACCESS_TOKEN_EXPIRES || '300', 10)
const refreshTokenExpires = parseInt(process.env.REFRESH_TOKEN_EXPIRES || '1200', 10)  

// options to cookies
export const accessTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + accessTokenExpires * 60 * 60 * 1000),
  maxAge: accessTokenExpires * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: 'lax',
  secure: false
}


export const refreshTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + refreshTokenExpires * 24 * 60 * 60 * 1000),
  maxAge: refreshTokenExpires * 24 * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: 'lax',
  secure: false
} 


export const sendToken = (user: IUser, statusCode: number, res: Response) => {
  const accessToken = user.SignAccessToken()
  const refreshToken = user.SignRefreshToken()
   // upload session to redis
  redis.set(user._id as string, JSON.stringify(user) as any)

  
  // only set secure to true in production
  if(process.env.NODE_ENV === 'production'){
    accessTokenOptions.secure = true
  }

  res.cookie('access_token', accessToken, accessTokenOptions)
  res.cookie("refresh_token", refreshToken, refreshTokenOptions)

  res.status(statusCode).json({
    success: true,
    user,
    accessToken
  })
}
