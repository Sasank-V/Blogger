// app/api/dashboard/[userId]/route.ts
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connect_DB } from "@/utils/DB";
import Post from "@/models/post.model";

export async function GET(
  request: Request,
  context: { params: { userId: string } } // Keep it required
) {
  await connect_DB();
  const { userId } = await Promise.resolve(context.params);

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

    // Compute engagement rate as a percentage:
    const engagementRate = summary.totalViews
      ? Number(
          (
            ((summary.totalLikes + summary.totalComments) /
              summary.totalViews) *
            100
          ).toFixed(1)
        )
      : 0;

    // For demonstration purposes, we simulate change metrics with dummy values.
    const stats = {
      totalViews: summary.totalViews,
      totalLikes: summary.totalLikes,
      totalComments: summary.totalComments,
      engagementRate, // computed from current totals
      viewsChange: 12.5, // simulated value; in a real app, compute based on history
      likesChange: 8.3, // simulated value
      commentsChange: -2.1, // simulated value
      engagementChange: 1.7, // simulated value
    };

    // Fetch posts with limited fields for a card view
    // We return _id, title, an excerpt of the content (first 150 chars),
    // createdAt and optionally tags/categories if needed.
    const posts = await Post.find({ author: userId })
      .sort({ createdAt: -1 })
      .select("title content createdAt categories tags")
      .lean();

    const postCards = posts.map((post) => ({
      _id: post._id,
      title: post.title,
      excerpt:
        post.content.substring(0, 150) +
        (post.content.length > 150 ? "..." : ""),
      createdAt: post.createdAt,
      categories: post.categories,
      tags: post.tags,
    }));

    return NextResponse.json({ stats, posts: postCards }, { status: 200 });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
