// app/api/posts/route.ts
import Post from "@/models/post.model";
import { connect_DB } from "@/utils/DB";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // Connect to MongoDB
  await connect_DB();

  // Parse the request body
  const body = await request.json();
  const {
    title,
    content,
    author, // expects the User ObjectId string
    categories = [],
    tags = [],
    images = [],
    isPublished = false,
  } = body;

  // Basic validation
  if (!title || !content || !author) {
    return NextResponse.json(
      { error: "Missing required fields: title, content, or author" },
      { status: 400 }
    );
  }

  try {
    // Create the new post
    const newPost = await Post.create({
      title,
      content,
      author,
      categories,
      tags,
      images,
      isPublished,
      // likes, views, commentCount will use default values
    });

    return NextResponse.json(
      { message: "Post created successfully", post: newPost },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
