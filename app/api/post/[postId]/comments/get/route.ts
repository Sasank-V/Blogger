// app/api/post/[postId]/comments/get/route.ts
import { NextResponse } from "next/server";
import { connect_DB } from "@/utils/DB";
import Comment from "@/models/comment.model";
import mongoose from "mongoose";

export async function GET(
  request: Request,
  context: { params: { postId: string } } // Keep it required
) {
  await connect_DB();
  const { postId } = await Promise.resolve(context.params);

  // Validate the postId is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
  }

  try {
    const comments = await Comment.find({ post: postId })
      .sort({ createdAt: -1 })
      .populate("author", "username email avatar") // populate selected author fields
      .lean();

    return NextResponse.json({ comments }, { status: 200 });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
