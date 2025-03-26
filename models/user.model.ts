import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  oauthProvider: string; // e.g., 'google', 'github'
  oauthId: string; // provider-specific user ID
  bio?: string;
  avatar?: string;
  role: "user" | "admin";
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    username: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    oauthProvider: { type: String, required: true },
    oauthId: { type: String, required: true, unique: true },
    bio: { type: String, default: "" },
    avatar: { type: String, default: "" }, // URL to avatar image
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>("User", UserSchema);
export default User;
