import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Post from "@/models/post.model";
import { connect_DB } from "@/utils/DB";

export async function POST(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    await connect_DB();
    const { postId } = params;

    // Validate postId
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return NextResponse.json({ error: "Invalid Post ID" }, { status: 400 });
    }

    // Increment the like count
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $inc: { likes: 1 } },
      { new: true }
    );

    if (!updatedPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Like incremented successfully",
      likes: updatedPost.likes,
    });
  } catch (error) {
    console.error("Error incrementing like:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
