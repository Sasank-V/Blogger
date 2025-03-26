// app/api/comments/route.ts
import Comment from "@/models/comment.model";
import { connect_DB } from "@/utils/DB";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  await connect_DB();

  // Parse the incoming JSON body
  const { post, author, content, parentComment } = await request.json();

  // Basic validation: Ensure required fields are provided
  if (!post || !author || !content) {
    return NextResponse.json(
      {
        error:
          "Missing required fields: post, author, and content are required",
      },
      { status: 400 }
    );
  }

  try {
    // Create a new comment document
    const newComment = await Comment.create({
      post,
      author,
      content,
      parentComment: parentComment || null, // Set to null if not provided
    });

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
