import mongoose, { Model } from "mongoose";

interface faqItem extends mongoose.Document {
  question: string;
  answer: string;
}

interface Category extends mongoose.Document {
  title: string;
}

interface BannerImage extends mongoose.Document {
  public_id: string;
  url: string;
}

interface Layout extends mongoose.Document {
  type: string;
  faq: faqItem[];
  category: Category[];
  banner: {
    image: BannerImage;
    title: string;
    subTitle: string;
  };
}

const faqSchema = new mongoose.Schema<faqItem>({
  question: { type: String },
  answer: { type: String },
});

const categorySchema = new mongoose.Schema<Category>({
  title: { type: String },
});

const bannerImageSchema = new mongoose.Schema<BannerImage>({
  public_id: { type: String },
  url: { type: String },
});

const layoutSchema = new mongoose.Schema<Layout>({
  type: { type: String },
  faq: [faqSchema],
  category: [categorySchema],
  banner: {
    image: bannerImageSchema,
    title: { type: String },
    subTitle: { type: String },
  },
});

const LayoutModel: Model<Layout> =  mongoose.model('Layout', layoutSchema);
export default LayoutModel;
