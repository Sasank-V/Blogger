import { NextResponse } from "next/server";
import { connect_DB } from "@/utils/DB";
import Post from "@/models/post.model";
import mongoose from "mongoose";
import "@/models/user.model";

export async function GET(
  request: Request,
  context: { params: { userId: string } } // Keep it required
) {
  await connect_DB();

  // Destructure params asynchronously
  const { userId } = await Promise.resolve(context.params);

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
  }

  try {
    // Find posts by the given user ID
    const posts = await Post.find({ author: userId })
      .sort({ createdAt: -1 })
      .populate("author", "username email avatar bio")
      .lean();
    // console.log(posts);

    return NextResponse.json({ posts }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user posts:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
