import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import {
  addAnswer,
  addQuestion,
  addReplyReview,
  addReview,
  deleteCourse,
  editCourse,
  getAllAdminCourses,
  getAllCourses,
  getCourseByUser,
  getSingleCourse,
  UploadCourse,
} from "../controller/course.controller";

const courseRouter = express.Router();

courseRouter.post(
  "/create-course",
  isAuthenticated,
  authorizeRoles("admin"),
  UploadCourse
);

courseRouter.put(
  "/edit-course/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  editCourse
);

courseRouter.get("/get-course/:id", getSingleCourse);

courseRouter.get("/get-courses", getAllCourses);

courseRouter.get("/get-course-content/:id", isAuthenticated, getCourseByUser);

courseRouter.put("/add-question", isAuthenticated, addQuestion);

courseRouter.put("/add-answer", isAuthenticated, addAnswer);
courseRouter.put("/add-review/:id", isAuthenticated, addReview);

courseRouter.put("/add-reply", isAuthenticated, addReplyReview);

courseRouter.get(
  "/get-all-courses",
  isAuthenticated,
  authorizeRoles("admin"),
  getAllAdminCourses
);

courseRouter.delete(
  "/delete-course",
  isAuthenticated,
  authorizeRoles("admin"),
  deleteCourse
);

export default courseRouter;
