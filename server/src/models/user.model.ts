import mongoose, { Model } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const emailRegexPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  avatar: {
    public_id: string;
    url: string;
  };
  role: string;
  isVerified: boolean;
  courses: Array<{courseId: string}>;
  comparePassword: (password: string) => Promise<boolean>;
  SignAccessToken: () => string;
  SignRefreshToken: () => string;
}

const userSchema = new mongoose.Schema<IUser>({
   name: {
    type: String,
    required: [true, "Please enter your name"],
   },
   email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    validate: {
      validator: function (v: string) {
        return emailRegexPattern.test(v);
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minlength: [6, "Your password must be longer than 6 characters"],
    select: false,
  },
  avatar: {
    public_id: String,
    url: String,
  },
  role: {
    type: String,
    default: "user",
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  courses: [
    {
      courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    },
  ],  
}, {timestamps: true})


// Hash password before saving user
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
  next();
});


// Compare user password
userSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

// sign access token
userSchema.methods.SignAccessToken = function () {
  return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN || ' ', {
    expiresIn: '5m'
  })
}

// refresh token
userSchema.methods.SignRefreshToken = function () {
  return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN || ' ', {
    expiresIn: '3d'
  })
}

const userModel: Model<IUser> = mongoose.model("User", userSchema);
export default userModel;
