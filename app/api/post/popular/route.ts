import { NextRequest, NextResponse } from "next/server";
import { connect_DB } from "@/utils/DB";
import Post from "@/models/post.model";

export async function GET(req: NextRequest) {
  try {
    await connect_DB();

    const popularPosts = await Post.find({ isPublished: true })
      .sort({ likes: -1, views: -1 })
      .limit(10)
      .select("title slug views _id");

    return NextResponse.json(popularPosts);
  } catch (error) {
    console.error("Error fetching popular posts:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
