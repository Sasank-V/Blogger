// app/api/post/popular/route.ts
import { NextResponse } from "next/server";
import { connect_DB } from "@/utils/DB";
import Post from "@/models/post.model";
import "@/models/user.model";

export async function GET() {
  await connect_DB();

  try {
    const posts = await Post.find({ isPublished: true })
      .sort({ likes: -1, views: -1 })
      .limit(5)
      .populate("author", "username avatar bio")
      .lean();

    return NextResponse.json({ posts }, { status: 200 });
  } catch (error) {
    console.error("Error fetching top posts:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
