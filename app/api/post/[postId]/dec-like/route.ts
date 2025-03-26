// app/api/posts/[postId]/decrementLikes/route.ts
import Post from "@/models/post.model";
import { connect_DB } from "@/utils/DB";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { postId: string } }
) {
  await connect_DB();
  const { postId } = params;

  try {
    // Decrement the 'likes' field by 1.
    // Optional: prevent likes from going below 0.
    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Ensure likes don't fall below zero.
    if (post.likes <= 0) {
      return NextResponse.json(
        { message: "No likes to decrement" },
        { status: 200 }
      );
    }

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $inc: { likes: -1 } },
      { new: true }
    );

    return NextResponse.json(
      { message: "Likes decremented successfully", post: updatedPost },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error decrementing likes:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
