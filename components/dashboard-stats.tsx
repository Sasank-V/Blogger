import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { UserStats } from "@/lib/types";
import { Eye, Heart, MessageCircle, TrendingUp } from "lucide-react";

interface DashboardStatsProps {
  stats: UserStats | null; // Allow stats to be null initially
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  if (!stats) {
    return (
      <div className="text-center text-muted-foreground">Loading stats...</div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Views</CardTitle>
          <Eye className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.totalViews?.toLocaleString() || 0}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats.viewsChange >= 0 ? "+" : ""}
            {stats.viewsChange ?? 0}% from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
          <Heart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.totalLikes?.toLocaleString() || 0}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats.likesChange >= 0 ? "+" : ""}
            {stats.likesChange ?? 0}% from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Comments</CardTitle>
          <MessageCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.totalComments?.toLocaleString() || 0}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats.commentsChange >= 0 ? "+" : ""}
            {stats.commentsChange ?? 0}% from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.engagementRate ?? 0}%</div>
          <p className="text-xs text-muted-foreground">
            {stats.engagementChange >= 0 ? "+" : ""}
            {stats.engagementChange ?? 0}% from last month
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
