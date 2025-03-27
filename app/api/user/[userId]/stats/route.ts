// app/api/dashboard/[userId]/route.ts
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connect_DB } from "@/utils/DB";
import Post from "@/models/post.model";

export async function GET(
  request: Request,
  context: { params: { userId: string } }
) {
  await connect_DB();
  const { userId } = await Promise.resolve(context.params);

  try {
    // Aggregate to get total views, likes, comments, and posts
    const summaryAgg = await Post.aggregate([
      { $match: { author: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalLikes: { $sum: "$likes" },
          totalViews: { $sum: "$views" },
          totalComments: { $sum: "$commentCount" },
          totalPosts: { $sum: 1 }, // Count total posts
        },
      },
    ]);

    // Extract stats from aggregation results
    const {
      totalLikes = 0,
      totalViews = 0,
      totalComments = 0,
      totalPosts = 0,
    } = summaryAgg[0] || {};

    // Calculate engagement rate: (likes + comments) / views * 100
    const engagementRate = totalViews
      ? Number((((totalLikes + totalComments) / totalViews) * 100).toFixed(2))
      : 0;

    return NextResponse.json(
      { totalPosts, totalViews, totalLikes, totalComments, engagementRate },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
