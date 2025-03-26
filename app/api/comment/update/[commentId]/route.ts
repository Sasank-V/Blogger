// app/api/comments/[commentId]/route.ts
import Comment from "@/models/comment.model";
import { connect_DB } from "@/utils/DB";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: { commentId: string } }
) {
  await connect_DB();
  const { commentId } = params;
  const updates = await request.json();

  try {
    const updatedComment = await Comment.findByIdAndUpdate(commentId, updates, {
      new: true,
    });

    if (!updatedComment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Comment updated successfully", comment: updatedComment },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating comment:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
