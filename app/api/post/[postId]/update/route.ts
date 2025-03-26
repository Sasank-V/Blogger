// app/api/posts/[postId]/route.ts
import Post from "@/models/post.model";
import { connect_DB } from "@/utils/DB";
import { NextResponse } from "next/server";

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
