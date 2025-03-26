import Post from "@/models/post.model";
import { connect_DB } from "@/utils/DB";
import { NextResponse } from "next/server";
import { getCategoryClassifyPrompt, askGemini } from "@/utils/AI";

export async function POST(request: Request) {
  try {
    await connect_DB();

    // Log incoming request
    const body = await request.json();
    console.log("📥 Incoming request body:", body);

    const {
      title,
      content,
      author,
      categories = [],
      tags = [],
      images = [],
      isPublished = false,
    } = body;

    if (!title || !content || !author) {
      console.error("⚠️ Validation failed. Missing fields:", {
        title,
        content,
        author,
      });
      return NextResponse.json(
        { error: "Missing required fields: title, content, or author" },
        { status: 400 }
      );
    }

    console.log("✅ All required fields are present.");

    // Prepare data for saving
    const newPost = await Post.create({
      title,
      content,
      author,
      categories,
      tags,
      images,
      isPublished,
    });

    console.log("✅ Post created successfully:", newPost);
    return NextResponse.json(
      { message: "Post created successfully", post: newPost },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("❌ Error creating post:", error.message || error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
