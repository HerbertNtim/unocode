import path from "path";
import ejs from "ejs";
import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary";
import { createCourse, getAllCoursesService } from "../services/course.service";
import CourseModel from "../models/course.model";
import { redis } from "../utils/redis";
import mongoose from "mongoose";
import sendMail from "../utils/sendMail";
import notificationModel from "../models/notification.model";

// Upload a course
export const UploadCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const thumbnail = data.thumbnail;
      if (thumbnail) {
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "courses",
        });

        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }

      createCourse(data, res, next);
    } catch (error: any) {
      console.log("Error in the course controller");
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Edit course
export const editCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const thumbnail = data.thumbnail;
      if (thumbnail) {
        await cloudinary.v2.uploader.destroy(data.thumbnail.public_id);

        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "courses",
        });

        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }

      const courseId = req.params.id;
      const course = await CourseModel.findByIdAndUpdate(
        courseId,
        {
          $set: data,
        },
        { new: true }
      );
    } catch (error: any) {
      console.log("Error in the course controller editCourse");
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Get a single course ---without purchasing
export const getSingleCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courseId = req.params.id;

      const isCourseExist = await redis.get(courseId);
      if (isCourseExist) {
        const course = JSON.parse(isCourseExist);
        res.status(200).json({
          success: true,
          course,
        });
      } else {
        const course = await CourseModel.findById(courseId).select(
          "-courseData.videoUrl -courseData.suggestions -courseData.questions -courseData.links"
        );
        if (!course) {
          return next(new ErrorHandler("Course not found", 404));
        }

        await redis.set(courseId, JSON.stringify(course), 'EX', 604800);

        res.status(200).json({
          success: true,
          course,
        });
      }
    } catch (error: any) {
      console.log("Error in the course controller getSingleCourse");
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Get all courses
export const getAllCourses = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cacheExist = await redis.get("allCourses");
      if (cacheExist) {
        const courses = JSON.parse(cacheExist);
        res.status(200).json({
          success: true,
          courses,
        });
      } else {
        const courses = await CourseModel.find().select(
          "-courseData.videoUrl -courseData.suggestions -courseData.questions -courseData.links"
        );
        if (!courses) {
          return next(new ErrorHandler("No Course found", 404));
        }

        await redis.set("allCourses", JSON.stringify(courses));

        res.status(200).json({
          success: true,
          courses,
        });
      }
    } catch (error: any) {
      console.log("Error in courses controller getAllCourses");
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Get course contents
export const getCourseByUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userCourseList = req.user?.courses;
      const courseId = req.params.id;

      const courseExist = userCourseList?.find(
        (course: any) => course._id.toString() === courseId
      );

      if (!courseExist) {
        return next(
          new ErrorHandler("You are not eligible to access this course", 404)
        );
      }

      const course = await CourseModel.findById(courseId);
      const content = course?.courseData;
    } catch (error: any) {
      console.log("Error in the courses controller getCourseByUser");
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Add Questions to course
interface IAddQuestionData {
  question: string;
  courseId: string;
  contentId: string;
}

export const addQuestion = CatchAsyncError(
  async (res: Response, req: Request, next: NextFunction) => {
    try {
      const { question, courseId, contentId } = req.body as IAddQuestionData;
      const course = await CourseModel.findById(courseId);

      if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return next(new ErrorHandler("Invalid Content id", 400));
      }

      const courseContent = course?.courseData?.find((item: any) =>
        item._id.equals(contentId)
      );

      if (!courseContent) {
        return next(new ErrorHandler("Invalid Content id", 400));
      }

      // Create new question object
      const newQuestion: any = {
        user: req.user,
        question,
        questionReplies: [],
      };

      // add question to course course content
      courseContent.questions.push(newQuestion);

      // creating notification
      await notificationModel.create({
        user: req.user?._id,
        title: "New Question",
        message: `You have new question from ${req.user?.name} in ${courseContent?.title}`,
      });

      // save question
      await course?.save();

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      console.log("Error in course controller addQuestion");
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Add answers to questions
interface IAddAnswer {
  questionId: string;
  contentId: string;
  answer: string;
  courseId: string;
}

export const addAnswer = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { questionId, courseId, contentId, answer } =
        req.body as IAddAnswer;
      const course = await CourseModel.findById(courseId);

      if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return next(new ErrorHandler("Invalid Content id", 400));
      }

      const courseContent = course?.courseData?.find((item: any) =>
        item._id.equals(questionId)
      );

      if (!courseContent) {
        return next(new ErrorHandler("Invalid Content id", 400));
      }

      const question = courseContent?.questions?.find((item: any) =>
        item._id.equals(questionId)
      );
      if (!question) {
        return next(new ErrorHandler("Invalid question id", 400));
      }

      // Create new answer
      const newAnswer: any = {
        user: req.user,
        answer,
      };

      // add answer to course course content
      question.questionReplies.push(newAnswer);

      await course?.save();

      if (req.user?._id === question.user._id) {
        // create course notification
        await notificationModel.create({
          user: req.user?._id,
          title: "New Answer",
          message: `You have received a reply in ${courseContent.title}`,
        });
      } else {
        const data = {
          name: question.user.name,
          title: courseContent.title,
        };

        const html = await ejs.renderFile(
          path.join(__dirname, "../mails/questions-reply.ejs"),
          data
        );

        try {
          await sendMail({
            email: question.user.email,
            subject: "Question Reply",
            template: "questions-reply.ejs",
            data,
          });
        } catch (error: any) {
          return next(new ErrorHandler(error.message, 500));
        }
      }

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      console.log("Error in course controller addAnswer");
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Add Review in Course
interface IReview {
  review: string;
  courseId: string;
  rating: number;
  userId: string;
}

export const addReview = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courseList = req.user?.courses;

      const courseId = req.params.id;

      // Checking if course exists
      const courseExist = courseList?.some(
        (course: any) => course._id.toString() === courseId
      );
      if (!courseExist)
        return next(
          new ErrorHandler("You are not authorized to access this course", 404)
        );

      const course = await CourseModel.findById(courseId);

      const { review, rating } = req.body as IReview;

      const reviewData: any = {
        user: req.user,
        rating,
        comment: review,
      };
      course?.reviews.push(reviewData);

      let avg = 0;

      course?.reviews.forEach((rev: any) => {
        avg += rev.rating;
      });

      if (course) {
        course.rating = avg / course.reviews.length;
      }

      await course?.save();

      const notification = {
        title: "New Review Received",
        message: `${req.user?.name} has given a review on the course ${course?.name}`,
      };

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      console.log("Error in course controller addReview");
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Add reply to a review
interface IReplyReview {
  comment: string;
  reviewId: string;
  courseId: string;
}

export const addReplyReview = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { comment, reviewId, courseId } = req.body;

      const course = await CourseModel.findById(courseId);
      if (!course) return next(new ErrorHandler("No course found", 404));

      const review = course?.reviews?.find(
        (rev: any) => rev._id.toString() === reviewId
      );
      if (!review)
        return next(new ErrorHandler("You cannot reply to message", 404));

      const replyData: any = {
        user: req.user,
        comment,
      };

      if (!review.commentReplies) {
        return (review.commentReplies = []);
      }

      review?.commentReplies.push(replyData);
      await course?.save();

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      console.log("Error in course controller addReplyReview");
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Get all users ---only for admins
export const getAllAdminCourses = CatchAsyncError(
  async (res: Response, next: NextFunction) => {
    try {
      getAllCoursesService(res);
    } catch (error: any) {
      console.log("Error in the courses controller getAllAdminCourses");
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Delete Course
export const deleteCourse = CatchAsyncError(
  async (res: Response, req: Request, next: NextFunction) => {
    try {
      const { id } = req.body;
      const course = await CourseModel.findById({ id });

      if (!course) return next(new ErrorHandler("No course found", 404));

      await course.deleteOne({ id });

      await redis.del(id);

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      console.log("Error in course controller deleteCourse");
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
