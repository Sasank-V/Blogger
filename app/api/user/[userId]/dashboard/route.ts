// app/api/dashboard/[userId]/route.ts
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connect_DB } from "@/utils/DB";
import Post from "@/models/post.model";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  await connect_DB();
  const { userId } = params;

  try {
    // Aggregation to get user post summary (total posts, likes, views, comments)
    const summaryAgg = await Post.aggregate([
      { $match: { author: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalPosts: { $sum: 1 },
          totalLikes: { $sum: "$likes" },
          totalViews: { $sum: "$views" },
          totalComments: { $sum: "$commentCount" },
        },
      },
    ]);

    const summary = summaryAgg[0] || {
      totalPosts: 0,
      totalLikes: 0,
      totalViews: 0,
      totalComments: 0,
    };

    // Fetch posts with limited fields for a card view
    // Here we only return _id, title, an excerpt of the content (first 150 chars),
    // createdAt and optionally tags/categories if needed.
    const posts = await Post.find({ author: userId })
      .sort({ createdAt: -1 })
      .select("title content createdAt categories tags") // selecting fields
      .lean();

    // Map the posts to include an excerpt of content
    const postCards = posts.map((post) => ({
      _id: post._id,
      title: post.title,
      // Create a snippet by taking the first 150 characters; you can adjust this logic
      excerpt:
        post.content.substring(0, 150) +
        (post.content.length > 150 ? "..." : ""),
      createdAt: post.createdAt,
      categories: post.categories,
      tags: post.tags,
    }));

    return NextResponse.json({ summary, posts: postCards }, { status: 200 });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
