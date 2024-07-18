import { IUser } from './user.model';
import mongoose, { Model } from "mongoose";

interface IComment extends mongoose.Document {
  user: IUser;
  question: string;
  createdAt: Date;
  questionReplies: string[];
}

// Review 
interface IReview extends mongoose.Document {
  user: IUser;
  rating: number;
  comment: string;
  commentReplies: IComment[];
}

// Link 
interface ILink extends mongoose.Document {
  title: string;
  url: string;
}

// CourseData 
interface ICourseData extends mongoose.Document {
  title: string;
  description?: string;
  videoUrl: string;
  videoDuration: string;
  videoThumbnail: string;
  videoSection: string;
  videoPlayer: string;
  links: ILink[];
  suggestions: string;
  questions: IComment[];
}

// Course
interface ICourse extends mongoose.Document {
  name: string;
  description: string;
  price: number;
  estimatedPrice?: number;
  thumbnail: string;
  tags: string[];
  level: string;
  demoUrl: string;
  benefits: {title: string}[];
  prerequisites: { title: string }[];
  reviews: IReview[];
  courseData: ICourseData[];
  rating?: number;
  purchased?: boolean;
}

// Review Schema
const reviewSchema = new mongoose.Schema<IReview> ({
  user: Object,
  rating: {
    type: Number,
    default: 0
  },
  comment: String,
  commentReplies: [Object]
});

// Link Schema 
const linkSchema = new mongoose.Schema<ILink> ({
  url: String,
  title: String
});

// Comment Schema 
const commentSchema = new mongoose.Schema<IComment> ({
  user: Object,
  question: String,
  questionReplies: [Object]
});

// Course Data Schema
const courseDataSchema = new mongoose.Schema<ICourseData>({
  title: String,
  description: String,
  videoUrl: String, 
  videoDuration: String,
  videoSection: String, 
  videoPlayer: String,  
  links: [linkSchema],
  suggestions: String,
  questions: [commentSchema],
});


// Course Schema
const courseSchema = new mongoose.Schema<ICourse>({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  estimatedPrice: Number,
  thumbnail: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
      required: true
    }
  },
  tags: [String],
  level: {
    type: String,
    required: true
  },
  demoUrl: {
    type: String,
    required: true
  },
  benefits: [{title: String}],
  prerequisites: [{ title: String }],
  reviews: [reviewSchema],
  courseData: [courseDataSchema],
  rating: {
    type: Number,
    default: 0
  },
  purchased: {
    type: Number,
    default: 0
  },
}, {timestamps: true});


const CourseModel: Model<ICourse> = mongoose.model('Course', courseSchema);
export default CourseModel;
