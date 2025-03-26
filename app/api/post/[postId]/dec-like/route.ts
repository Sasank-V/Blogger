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

    // Find the post and ensure likes don't go below 0
    const post = await Post.findById(postId);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Ensure likes never go below zero
    if (post.likes > 0) {
      post.likes -= 1;
      await post.save();
    }

    return NextResponse.json({
      message: "Like decremented successfully",
      likes: post.likes,
    });
  } catch (error) {
    console.error("Error decrementing like:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
