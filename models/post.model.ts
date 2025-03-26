import mongoose, { Schema, Document, Types } from "mongoose";

export interface IPost extends Document {
  title: string;
  content: string;
  author: Types.ObjectId; // Reference to User
  categories: string[];
  tags: string[];
  likes: number;
  views: number;
  isPublished: boolean;
  commentCount: number;
  images: string[]; // Array of image URLs
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema: Schema<IPost> = new Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true }, // HTML or JSON (e.g., from a rich text editor)
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    categories: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    likes: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: false },
    commentCount: { type: Number, default: 0 },
    images: { type: [String], default: [] }, // Image URLs array
  },
  { timestamps: true }
);

const Post = mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);
export default Post;
