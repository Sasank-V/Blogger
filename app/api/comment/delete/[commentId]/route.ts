// app/api/comments/[commentId]/route.ts
import Comment from "@/models/comment.model";
import { connect_DB } from "@/utils/DB";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: { commentId: string } }
) {
  await connect_DB();
  const { commentId } = params;

  try {
    // Find and delete the comment by its ID
    const deletedComment = await Comment.findByIdAndDelete(commentId);

    if (!deletedComment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Comment deleted successfully", comment: deletedComment },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
