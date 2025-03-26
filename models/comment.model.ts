import mongoose, { Schema, Document, Types } from "mongoose";

export interface IComment extends Document {
  post: Types.ObjectId; // Reference to the Post
  author: Types.ObjectId; // Reference to the User who made the comment
  content: string;
  parentComment?: Types.ObjectId; // Optional for nested replies
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema: Schema<IComment> = new Schema(
  {
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    parentComment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    likes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Comment =
  mongoose.models.Comment || mongoose.model<IComment>("Comment", CommentSchema);
export default Comment;
