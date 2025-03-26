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
  const { userId } = context.params;

  try {
    // Aggregate to get total views, likes, and comments
    const summaryAgg = await Post.aggregate([
      { $match: { author: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalLikes: { $sum: "$likes" },
          totalViews: { $sum: "$views" },
          totalComments: { $sum: "$commentCount" },
        },
      },
    ]);

    const {
      totalLikes = 0,
      totalViews = 0,
      totalComments = 0,
    } = summaryAgg[0] || {};

    // Calculate engagement rate: (likes + comments) / views * 100
    const engagementRate = totalViews
      ? Number((((totalLikes + totalComments) / totalViews) * 100).toFixed(2))
      : 0;

    return NextResponse.json(
      { totalViews, totalLikes, engagementRate },
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
