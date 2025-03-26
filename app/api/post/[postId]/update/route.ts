import Post from "@/models/post.model";
import { connect_DB } from "@/utils/DB";
import { NextResponse } from "next/server";
import { getCategoryClassifyPrompt, askGemini } from "@/utils/AI";
import { getEmbedding } from "@/utils/embeddings";
import { upsertVectorDB } from "@/utils/vectorDB";

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

  // If content is updated, get AI-suggested categories and tags and merge them,
  // then generate a new embedding and upsert it to the vector DB.
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

    // Generate new embedding from the updated content
    const embedding = await getEmbedding(filteredUpdates.content);

    // Upsert the new embedding into your vector DB using the updated content.
    await upsertVectorDB(postId, embedding, filteredUpdates.content);

    // Optionally update the post document with the new embedding
    filteredUpdates.embedding = embedding;
  }

  try {
    // Update the post in MongoDB with the filtered updates
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
