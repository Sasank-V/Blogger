"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Sun,
  Moon,
  Edit,
  Settings,
  FileText,
  Eye,
  MessageSquare,
  Mail,
  MapPin,
  LinkIcon,
} from "lucide-react";
import { BlogPageSkeleton } from "@/components/blog-page-skeleton";
import type { UserStats } from "@/lib/types";
import { getUserStats } from "@/lib/data"; // Ensure correct path

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();

  // Fetch user stats
  useEffect(() => {
    const fetchStats = async () => {
      if (!session?.user?.id) return;
      try {
        const userStats = await getUserStats(session.user.id);
        setStats(userStats);
        setError(null);
      } catch (error) {
        console.error("Error fetching user stats:", error);
        setError("Failed to load user stats. Please try again later.");
      }
    };

    fetchStats();
  }, [session?.user?.id]);

  // Handle theme toggle
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  // Loading state
  if (status === "loading") {
    return <BlogPageSkeleton />;
  }

  // Error or no session
  if (!session || !session.user) {
    return (
      <div className="container mx-auto py-8 text-center text-muted-foreground">
        Profile not found. Please log in to access your profile.
      </div>
    );
  }

  const { user } = session;

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Profile Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            {/* Avatar */}
            <Avatar className="h-24 w-24 border-4 border-background">
              <AvatarImage
                src={user.image || "/placeholder.svg"}
                alt={user.name || "User"}
              />
              <AvatarFallback>
                {user.name?.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold">
                {user.name || "Unnamed User"}
              </h1>
              <p className="text-muted-foreground mb-2">{user.email}</p>

              {/* Categories/Tags */}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={toggleTheme}>
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Section */}
      <div className="grid gap-4 mt-6 md:grid-cols-2 lg:grid-cols-3">
        {error ? (
          <div className="col-span-3 text-center text-red-500">{error}</div>
        ) : (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Posts
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.totalPosts?.toLocaleString() || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Views
                </CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.totalViews?.toLocaleString() || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Comments
                </CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.totalComments?.toLocaleString() || 0}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Profile Details */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Profile Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center">
            <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm">{user.email}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm">{user.location || "Unknown"}</span>
          </div>
          <div className="flex items-center">
            <LinkIcon className="h-4 w-4 mr-2 text-muted-foreground" />
            {user.website ? (
              <a
                href={user.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                {user.website}
              </a>
            ) : (
              <span className="text-sm text-muted-foreground">No website</span>
            )}
          </div>
          <Separator className="my-4" />
        </CardContent>
      </Card>
    </div>
  );
}
