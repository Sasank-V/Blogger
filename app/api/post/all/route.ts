// app/api/posts/route.ts
import { NextResponse } from "next/server";
import { connect_DB } from "@/utils/DB";
import Post from "@/models/post.model";
import "@/models/user.model";

export async function GET(request: Request) {
  await connect_DB();

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const skip = (page - 1) * limit;

  try {
    // Find published posts, applying pagination and populating author fields
    const posts = await Post.find({ isPublished: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author", "username avatar bio");

    // Optionally, get the total count for pagination
    const totalPosts = await Post.countDocuments({ isPublished: true });

    return NextResponse.json(
      { posts, page, limit, totalPosts },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
