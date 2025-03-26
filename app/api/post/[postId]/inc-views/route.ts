// app/api/post/[postId]/inc-views/route.ts
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
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!updatedPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Views incremented successfully",
      views: updatedPost.views,
    });
  } catch (error) {
    console.error("Error incrementing views:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
