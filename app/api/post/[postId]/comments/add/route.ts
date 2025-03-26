import { NextResponse } from "next/server";
import { connect_DB } from "@/utils/DB";
import Comment from "@/models/comment.model";
import Post from "@/models/post.model";
import mongoose from "mongoose";

export async function POST(
  request: Request,
  { params }: { params: { postId: string } }
) {
  await connect_DB();
  const { postId } = params;

  // Validate the postId is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
  }

  // Parse the request body
  const { author, content, parentComment } = await request.json();

  // Validate required fields
  if (!author || !content) {
    return NextResponse.json(
      { error: "Missing required fields: author and content" },
      { status: 400 }
    );
  }

  try {
    // Create a new comment document
    const newComment = await Comment.create({
      post: postId,
      author,
      content,
      parentComment: parentComment || null,
      likes: 0,
    });

    // Optionally update the comment count on the Post document
    await Post.findByIdAndUpdate(postId, { $inc: { commentCount: 1 } });

    return NextResponse.json(
      { message: "Comment added successfully", comment: newComment },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding comment:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
