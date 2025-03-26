import Post from "@/models/post.model";
import { connect_DB } from "@/utils/DB";
import { NextResponse } from "next/server";
import { getCategoryClassifyPrompt, askGemini } from "@/utils/AI";

export async function PATCH(
  request: Request,
  { params }: { params: { postId: string } }
) {
  await connect_DB();
  const { postId } = params;
  const updates = await request.json();

  // Define the allowed fields for updates
  const allowedUpdates = [
    "title",
    "content",
    "categories",
    "tags",
    "images",
    "isPublished",
  ];
  const filteredUpdates: Partial<typeof updates> = {};

  // Filter out any fields not in the allowedUpdates array
  for (const key of allowedUpdates) {
    if (key in updates) {
      filteredUpdates[key] = updates[key];
    }
  }

  // If content is updated, get AI-suggested categories and tags and merge them.
  if (filteredUpdates.content) {
    const prompt = getCategoryClassifyPrompt(filteredUpdates.content);
    const aiResult = await askGemini(prompt);

    // Merge client-provided categories/tags with AI suggestions
    const clientCategories = Array.isArray(filteredUpdates.categories)
      ? filteredUpdates.categories
      : [];
    const clientTags = Array.isArray(filteredUpdates.tags)
      ? filteredUpdates.tags
      : [];

    const finalCategories = Array.from(
      new Set([...clientCategories, ...aiResult.categories])
    );
    const finalTags = Array.from(new Set([...clientTags, ...aiResult.tags]));

    filteredUpdates.categories = finalCategories;
    filteredUpdates.tags = finalTags;
  }

  try {
    // Update the post with the filtered fields
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $set: filteredUpdates },
      { new: true, runValidators: true }
    );

    if (!updatedPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Post updated successfully", post: updatedPost },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
