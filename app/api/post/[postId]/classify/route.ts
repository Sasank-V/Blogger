// app/api/posts/[postId]/updateCategoriesAndTags/route.ts
import { NextResponse } from "next/server";
import { connect_DB } from "@/utils/DB";
import Post from "@/models/post.model";
import { askGemini, getCategoryClassifyPrompt } from "@/utils/AI";
import { IPost } from "../../../../../models/post.model";

export async function GET(
  request: Request,
  { params }: { params: { postId: string } }
) {
  // Connect to MongoDB
  await connect_DB();
  const { postId } = params;

  // Retrieve the post from the database
  const post = await Post.findById<IPost>(postId);
  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  // Construct a very detailed prompt for the Gemini API
  const prompt = getCategoryClassifyPrompt(post.content);

  try {
    // Call the Gemini API using our helper function
    const { categories, tags } = await askGemini(prompt);

    // Update the post with the new categories and tags
    post.categories = categories;
    post.tags = tags;
    await post.save();

    return NextResponse.json(
      { message: "Post updated with new categories and tags", post },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating post with Gemini API response:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
