"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Heart, MessageCircle, TrendingUp } from "lucide-react";
import type { UserStats } from "@/lib/types";
import { getUserStats } from "@/lib/data"; // Ensure this imports correctly

interface DashboardStatsProps {
  userId: string;
}

export function DashboardStats({ userId }: DashboardStatsProps) {
  const [stats, setStats] = useState<UserStats | null>(null);
  console.log("User id", userId);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const userStats = await getUserStats(userId);
        setStats(userStats);
      } catch (error) {
        console.error("Error fetching user stats:", error);
      }
    };

    fetchStats();
  }, [userId]);

  if (!stats) {
    return (
      <div className="text-center text-muted-foreground">Loading stats...</div>
    );
  } else {
    console.log(stats);
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
      {/* Total Views */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Views</CardTitle>
          <Eye className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.totalViews?.toLocaleString() || 0}
          </div>
        </CardContent>
      </Card>

      {/* Total Likes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
          <Heart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.totalLikes?.toLocaleString() || 0}
          </div>
        </CardContent>
      </Card>

      {/* Total Comments */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Comments</CardTitle>
          <MessageCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.totalComments?.toLocaleString() || 0}
          </div>
        </CardContent>
      </Card>

      {/* Engagement Rate */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.engagementRate ?? 0}%</div>
        </CardContent>
      </Card>
    </div>
  );
}
