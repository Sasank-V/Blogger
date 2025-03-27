// app/api/posts/[postId]/route.ts
import Post from "@/models/post.model";
import { connect_DB } from "@/utils/DB";
import { NextResponse } from "next/server";
import { deleteVectorDBRecord } from "@/utils/vectorDB";

export async function DELETE(
  request: Request,
  context: { params: { postId: string } }
) {
  await connect_DB();
  const { postId } = await Promise.resolve(context.params);

  try {
    // Delete the post from MongoDB
    const deletedPost = await Post.findByIdAndDelete(postId);
    if (!deletedPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Delete the vector record from the Pinecone index
    await deleteVectorDBRecord(postId);

    return NextResponse.json(
      { message: "Post deleted successfully", post: deletedPost },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
