import Post from "@/models/post.model";
import { connect_DB } from "@/utils/DB";
import { NextResponse } from "next/server";
import { getCategoryClassifyPrompt, askGemini } from "@/utils/AI";
import { getEmbedding } from "@/utils/embeddings";
import { upsertVectorDB } from "@/utils/vectorDB";

export async function POST(request: Request) {
  await connect_DB();

  const body = await request.json();
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
    return NextResponse.json(
      { error: "Missing required fields: title, content, or author" },
      { status: 400 }
    );
  }

  try {
    // Generate a detailed prompt from the post content and get AI suggestions
    const prompt = getCategoryClassifyPrompt(content);
    const aiResult = await askGemini(prompt);
    const finalCategories = Array.from(
      new Set([...categories, ...aiResult.categories])
    );
    const finalTags = Array.from(new Set([...tags, ...aiResult.tags]));

    // Generate the embedding for the content by directly passing the content text.
    const embedding = await getEmbedding(content);

    // Create the new post with the merged categories, tags, and the embedding field
    const newPost = await Post.create({
      title,
      content,
      author,
      categories,
      tags,
      images,
      isPublished,
      embedding, // Stored in MongoDB
    });

    // Update the vector database with the new post's embedding using the raw content.
    await upsertVectorDB(newPost._id.toString(), embedding, content);

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
