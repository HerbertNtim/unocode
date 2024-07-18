import mongoose, { Model } from "mongoose";

interface INotification extends mongoose.Document{
  title: string;
  message: string;
  status: string;
  userId: string;
}

const notificationSchema = new mongoose.Schema<INotification> ({
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'unread',
    required: true
  },
  userId: {
    type: String,
    required: true
  }
}, {timestamps: true});

const notificationModel: Model<INotification> = mongoose.model("Notification", notificationSchema)
export default notificationModel
