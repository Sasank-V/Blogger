// app/api/posts/[postId]/route.ts
import { NextResponse } from "next/server";
import { connect_DB } from "@/utils/DB";
import Post from "@/models/post.model";

export async function GET(
  request: Request,
  { params }: { params: { postId: string } }
) {
  await connect_DB();
  const { postId } = params;

  try {
    // Find the post by ID and populate the 'author' field with selected details
    const post = await Post.findById(postId).populate(
      "author",
      "username email avatar bio"
    );

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
