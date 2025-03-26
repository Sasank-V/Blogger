import Post from "@/models/post.model";
import { connect_DB } from "@/utils/DB";
import { NextResponse } from "next/server";
import { getCategoryClassifyPrompt, askGemini } from "@/utils/AI";

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
    // Generate a detailed prompt from the post content
    const prompt = getCategoryClassifyPrompt(content);
    // Call the Gemini API to get suggested categories and tags
    const aiResult = await askGemini(prompt);
    // Append the AI-suggested categories to those passed in from the client.
    // You can choose to override or merge; here we merge them.
    const finalCategories = Array.from(
      new Set([...categories, ...aiResult.categories])
    );
    const finalTags = Array.from(new Set([...tags, ...aiResult.tags]));

    // Create the new post with the merged categories and tags.
    const newPost = await Post.create({
      title,
      content,
      author,
      categories: finalCategories,
      tags: finalTags,
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
