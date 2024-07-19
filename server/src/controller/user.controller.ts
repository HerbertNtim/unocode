import { Request, Response, NextFunction } from "express";
import userModel, { IUser } from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendMail";

import {
  accessTokenOptions,
  refreshTokenOptions,
  sendToken,
} from "../utils/jwt";
import { redis } from "../utils/redis";
import {
  getAllUsersService,
  getUserById,
  updateUserRoleService,
} from "../services/user.service";
import cloudinary from "cloudinary";

// register user
interface IRegistrationBody {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

export const registerUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body;

      const isEmailExist = await userModel.findOne({ email });
      if (isEmailExist) {
        return next(new ErrorHandler("Email already exists", 400));
      }

      const user: IRegistrationBody = {
        name,
        email,
        password,
      };

      const activationToken = createActivationToken(user);

      const activationCode = activationToken.activationCode;

      const data = { user: { name: user.name }, activationCode };
      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/activation-mail.ejs"),
        data
      );

      try {
        await sendMail({
          email: user.email,
          subject: "Account Activation",
          template: "activation-mail.ejs",
          data,
        });

        res.status(201).json({
          success: true,
          message: `Account activation email has been sent to your email address: ${user.email}`,
          activationToken: activationToken.token,
        });
      } catch (error) {
        console.log(error);
        return next(new ErrorHandler("Email could not be sent", 400));
      }
    } catch (error: any) {
      next(new ErrorHandler(error.message, 400));
    }
  }
);

// activating user
interface IActivationToken {
  token: string;
  activationCode: string;
}

// create activation token
export const createActivationToken = (user: any): IActivationToken => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

  const token = jwt.sign(
    {
      user,
      activationCode,
    },
    process.env.ACTIVATION_SECRET as Secret,
    { expiresIn: "5m" }
  );

  return { token, activationCode };
};

// activate user
interface IActivateUser {
  activation_code: string;
  activation_token: {token: string};
}

export const activateUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activation_code, activation_token } = req.body as IActivateUser;

      // Ensure the activation token is a string
      const tokenString = String(activation_token.token);

      // verify the activation token
      const newUser: { user: IUser; activationCode: string } = jwt.verify(
        tokenString,
        process.env.ACTIVATION_SECRET as string
      ) as { user: IUser; activationCode: string };

      if (newUser.activationCode !== activation_code) {
        return next(new ErrorHandler("Invalid activation code", 400));
      }

      // creating new user
      const { name, email, password } = newUser.user;

      // check if user already exists
      const isUserExist = await userModel.findOne({
        email,
      });

      if (isUserExist) {
        if (!isUserExist.isVerified) {
          isUserExist.isVerified = true;
          await isUserExist.save();
        }
        return res.status(200).json({
          success: true,
          message: "User already exists and activated",
        });
      }
      // create new user in the database
      const user = await userModel.create({
        name,
        email,
        password,
        isVerified: true,
      });

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error: any) {
      console.log("Error in User activation");
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Login user
interface ILoginUserBody {
  email: string;
  password: string;
}

export const loginUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as ILoginUserBody;

      if (!email || !password) {
        return next(
          new ErrorHandler(
            "Please Provide Email and Password to Processed",
            400
          )
        );
      }

      const user = await userModel.findOne({ email }).select("+password");
      if (!user) {
        return next(
          new ErrorHandler("User does not Exist or create an account", 400)
        );
      }

      const isPasswordMatch = await user?.comparePassword(password);
      if (!isPasswordMatch) {
        return next(new ErrorHandler("Invalid Password", 400));
      }

      sendToken(user, 200, res);
    } catch (error) {
      console.log("error in user login", error);
      return next(new ErrorHandler("Invalid Credentials", 400));
    }
  }
);

// logout user
export const logoutUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.cookie("access_token", "", { maxAge: 1 });
      res.cookie("refresh_token", "", { maxAge: 1 });

      const userId = (req.user?._id as any) || "";
      await redis.del(userId);

      res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error) {
      console.log("Error in the log out controller", error);
      return next(new ErrorHandler("Failed to logout", 400));
    }
  }
);

// update access token
export const updateAccessToken = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("Received cookies:", req.cookies);

      const refresh_token = req.cookies.refresh_token as string;
      const decoded = jwt.verify(
        refresh_token,
        process.env.REFRESH_TOKEN as string
      ) as JwtPayload;

      console.log("Decoded token:", decoded);

      const message = "Couldn't find refresh token";
      if (!decoded) return next(new ErrorHandler(message, 400));

      const session = await redis.get(decoded.id as string);

      if (!session) return next(new ErrorHandler("Login to Continue", 400));

      const user = JSON.parse(session);

      const accessToken = jwt.sign(
        { id: user._id },
        process.env.ACCESS_TOKEN as string,
        { expiresIn: "5m" }
      );

      const refreshToken = jwt.sign(
        { id: user._id },
        process.env.REFRESH_TOKEN as string,
        { expiresIn: "3d" }
      );

      req.user = user;

      res.cookie("access_token", accessToken, accessTokenOptions);
      res.cookie("refresh_token", refreshToken, refreshTokenOptions);

      await redis.set(user._id, JSON.stringify(user), "EX", 604800); // 7 days

      res.status(200).json({
        success: true,
        accessToken,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// get user info
export const getUserInfo = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id as any;
      getUserById(userId, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// social Auth
interface ISocialAuth {
  name: string;
  email: string;
  avatar: string;
}

export const socialAuth = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, avatar } = req.body as ISocialAuth;
      const user = await userModel.findOne({ email });
      if (user) {
        sendToken(user, 200, res);
      } else {
        const newUser = await userModel.create({ name, email, avatar });
        sendToken(newUser, 200, res);
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Update user info
interface IUpdateUserInfo {
  name: string;
  email: string;
}

export const updateUserInfo = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email } = req.body as IUpdateUserInfo;
      if (!name && !email)
        return next(new ErrorHandler("Please provide name or email", 400));

      const userId = req.user?._id;
      const user = await userModel.findById(userId);

      if (email && user) {
        const isEmailExist = await userModel.findOne({ email });
        if (isEmailExist) {
          return next(new ErrorHandler("Email already exists", 400));
        }
        user.email = email;
      }

      if (name && user) user.name = name;

      await user?.save();
      await redis.set(userId as string, JSON.stringify(user));

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Update user password
interface IUpdatePassword {
  oldPassword: string;
  newPassword: string;
}

export const updatePassword = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { oldPassword, newPassword } = req.body as IUpdatePassword;

      const user = await userModel.findById(req.user?._id).select("+password");
      if (user?.password === undefined) {
        return next(new ErrorHandler("User not Found", 400));
      }

      const isPasswordMatch = await user?.comparePassword(oldPassword);

      if (!isPasswordMatch) {
        return next(new ErrorHandler("Invalid Password entered", 400));
      }

      user.password = newPassword;

      await user?.save();

      await redis.set(req.user?._id as string, JSON.stringify(user));

      res.status(2001).json({
        success: true,
        message: "Password updated successfully",
        user,
      });
    } catch (error: any) {
      console.log("Error in update password controller");
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Update profile picture
interface IUpdateProfilePicture {
  avatar: string;
}

export const updateUserAvatar = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { avatar } = req.body as IUpdateProfilePicture;
      const userId = req.user?._id;
      const user = await userModel.findById(userId);

      if (!user) return next(new ErrorHandler("User not found", 400));

      // upload image to cloudinary
      if (avatar && user) {
        if (user?.avatar?.public_id) {
          await cloudinary.v2.uploader.destroy(user?.avatar?.public_id);

          const myCloud = await cloudinary.v2.uploader.upload(avatar, {
            folder: "avatars",
            width: 150,
            crop: "scale",
          });
          user.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          };
        }
      } else {
        const myCloud = await cloudinary.v2.uploader.upload(avatar, {
          folder: "avatars",
          width: 150,
          crop: "scale",
        });
        user.avatar = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }

      await user?.save();
      await redis.set(userId as string, JSON.stringify(user));

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error: any) {
      console.log("Error in the update profile picture controller");
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Get all users ---only for admins
export const getAllUsers = CatchAsyncError(
  async (res: Response, next: NextFunction) => {
    try {
      getAllUsersService(res, next);
    } catch (error: any) {
      console.log("Error in the user controller getAllUsers");
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Update user role
export const updateUserRole = CatchAsyncError(
  async (res: Response, next: NextFunction, req: Request) => {
    try {
      const { id, role } = req.body;
      updateUserRoleService(res as any, id, role, next);
    } catch (error: any) {
      console.log("Error in the user controller updateUserRole");
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Delete User
export const deleteUser = CatchAsyncError(
  async (res: Response, req: Request, next: NextFunction) => {
    try {
      const { id } = req.body;
      const user = await userModel.findById({ id });

      if (!user) return next(new ErrorHandler("No user found", 404));

      await user.deleteOne({ id });

      await redis.del(id);

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error: any) {
      console.log("Error in user controller deleteUser");
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
