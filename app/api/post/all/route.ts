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
  const search = searchParams.get("search") || ""; // ✅ Get search query
  const skip = (page - 1) * limit;

  try {
    // Search condition (if search is provided)
    const searchCondition = search
      ? {
          $or: [
            { title: { $regex: search, $options: "i" } }, // Case-insensitive search in title
            { content: { $regex: search, $options: "i" } }, // Case-insensitive search in content
          ],
        }
      : {};

    // Combine search with other conditions
    const query = { isPublished: true, ...searchCondition };

    // Fetch posts with pagination and search
    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author", "username avatar bio");

    // Get total count for pagination
    const totalPosts = await Post.countDocuments(query);

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
