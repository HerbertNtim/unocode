import cloudinary from "cloudinary";
import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import LayoutModel from "../models/layout.model";

// Create Layout
export const createLayout = CatchAsyncError(
  async (res: Response, req: Request, next: NextFunction) => {
    try {
      const { type } = req.body;
      const isTypeExist = await LayoutModel.findOne({ type });
      if (isTypeExist)
        return next(new ErrorHandler(`This ${type} already exist`, 400));

      if (type === "Banner") {
        const { image, title, subTitle } = req.body;
        const myCloud = await cloudinary.v2.uploader.upload(image, {
          folder: "layout",
        });

        const banner = {
          image: {
            public_id: myCloud.public_id,
            url: myCloud.url,
          },
          title,
          subTitle,
        };

        await LayoutModel.create(banner);
      }

      if (type === "FAQ") {
        const { faq } = req.body;
        const faqItem = await Promise.all(
          faq.map((item: any) => {
            return {
              question: item.question,
              answer: item.answer,
            };
          })
        );
        await LayoutModel.create({ type: "FAQ", faq: faqItem });
      }

      if (type === "Categories") {
        const { categories } = req.body;
        const categoryItem = await Promise.all(
          categories.map((item: any) => {
            return {
              title: item.title,
            };
          })
        );
        await LayoutModel.create({
          type: "Categories",
          categories: categoryItem,
        });
      }

      res.status(200).json({
        success: true,
        message: "Layout created successfully",
      });
    } catch (error: any) {
      console.log("Error in layout controller createLayout");
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Edit Layout
export const editLayout = CatchAsyncError(
  async (res: Response, req: Request, next: NextFunction) => {
    try {
      const { type } = req.body;
      if (type === "Banner") {
        const bannerData: any = await LayoutModel.find({ type: "Banner" });
        const { image, title, subTitle } = req.body;

        if (bannerData) {
          await cloudinary.v2.uploader.destroy(bannerData.image.public_id);
        }
        const myCloud = await cloudinary.v2.uploader.upload(image, {
          folder: "layout",
        });

        const banner = {
          image: {
            public_id: myCloud.public_id,
            url: myCloud.url,
          },
          title,
          subTitle,
        };

        await LayoutModel.findByIdAndUpdate(bannerData.id, banner);
      }

      if (type === "FAQ") {
        const { faq } = req.body;
        const faqItem = await LayoutModel.findOne({ type: "FAQ" });
        const faqItems = await Promise.all(
          faq.map((item: any) => {
            return {
              question: item.question,
              answer: item.answer,
            };
          })
        );
        await LayoutModel.findByIdAndUpdate(faqItem?._id, {
          type: "FAQ",
          faq: faqItems,
        });
      }

      if (type === "Categories") {
        const { categories } = req.body;
        const categoriesData = await LayoutModel.findOne({
          type: "Categories",
        });
        const categoryItem = await Promise.all(
          categories.map((item: any) => {
            return {
              title: item.title,
            };
          })
        );
        await LayoutModel.findByIdAndUpdate(categoriesData?._id, {
          type: "Categories",
          categories: categoryItem,
        });
      }

      res.status(200).json({
        success: true,
        message: "Layout updated successfully",
      });
    } catch (error: any) {
      console.log("Error in layout controller editLayout");
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// get layout by type
export const getLayoutByType = CatchAsyncError(
  async (res: Response, req: Request, next: NextFunction) => {
    try {
      const {type} = req.body;
      
      const layout = await LayoutModel.find({type});

      res.status(200).json({
        success: true,
        layout,
      });
    } catch (error: any) {
      console.log("Error in the layout controller getLayoutByType");
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
