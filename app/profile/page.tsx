"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "next-themes";
import {
  Mail,
  MapPin,
  Calendar,
  LinkIcon,
  Edit,
  Settings,
  FileText,
  MessageSquare,
  Eye,
  Clock,
  Moon,
  Sun,
  PenTool,
} from "lucide-react";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  views: number;
  comments: number;
  readingTime: string;
  category: string;
}

interface BloggerProfile {
  name: string;
  username: string;
  avatar: string;
  bio: string;
  email: string;
  location: string;
  website: string;
  joinDate: string;
  totalPosts: number;
  totalViews: number;
  totalComments: number;
  categories: string[];
  posts: BlogPost[];
  drafts: BlogPost[];
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<BloggerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    // Simulate fetching profile data
    setTimeout(() => {
      setProfile({
        name: "Alex Johnson",
        username: "@alexjohnson",
        avatar: "/placeholder.svg?height=128&width=128",
        bio: "Tech blogger and web developer sharing insights on modern web development, UI/UX design, and developer productivity.",
        email: "alex.johnson@example.com",
        location: "San Francisco, CA",
        website: "alexjohnson.dev",
        joinDate: "January 2022",
        totalPosts: 42,
        totalViews: 128500,
        totalComments: 3240,
        categories: [
          "Web Development",
          "UI/UX Design",
          "JavaScript",
          "React",
          "Next.js",
        ],
        posts: [
          {
            id: 1,
            title: "Getting Started with Next.js 15",
            excerpt:
              "A comprehensive guide to the latest features in Next.js 15 and how to leverage them in your projects.",
            date: "2 days ago",
            views: 1240,
            comments: 24,
            readingTime: "8 min read",
            category: "Next.js",
          },
          {
            id: 2,
            title: "Building Accessible UI Components",
            excerpt:
              "Learn how to create UI components that are accessible to everyone, including keyboard navigation and screen readers.",
            date: "1 week ago",
            views: 3560,
            comments: 42,
            readingTime: "12 min read",
            category: "UI/UX Design",
          },
          {
            id: 3,
            title: "State Management in 2025",
            excerpt:
              "Exploring modern state management solutions and when to use each approach in your applications.",
            date: "2 weeks ago",
            views: 5280,
            comments: 37,
            readingTime: "10 min read",
            category: "React",
          },
        ],
        drafts: [
          {
            id: 4,
            title: "Performance Optimization Techniques",
            excerpt:
              "Advanced strategies to optimize your web application for better performance and user experience.",
            date: "Last edited 3 days ago",
            views: 0,
            comments: 0,
            readingTime: "15 min read",
            category: "Web Development",
          },
          {
            id: 5,
            title: "Building a Design System from Scratch",
            excerpt:
              "A step-by-step guide to creating your own design system that scales with your application.",
            date: "Last edited 1 week ago",
            views: 0,
            comments: 0,
            readingTime: "18 min read",
            category: "UI/UX Design",
          },
        ],
      });
      setLoading(false);
    }, 1000);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center text-muted-foreground">
          Loading profile...
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center text-muted-foreground">
          Profile not found
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-end mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              <Avatar className="h-24 w-24 border-4 border-background">
                <AvatarImage src={profile.avatar} alt={profile.name} />
                <AvatarFallback>{profile.name.substring(0, 2)}</AvatarFallback>
              </Avatar>

              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl font-bold">{profile.name}</h1>
                <p className="text-muted-foreground mb-2">{profile.username}</p>
                <p className="text-sm mb-4 max-w-md">{profile.bio}</p>

                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  {profile.categories.map((category) => (
                    <Badge key={category} variant="secondary">
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                  <span className="sr-only">Settings</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {profile.totalPosts.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">+3 new this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {profile.totalViews.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                +15% from last month
              </p>
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
                {profile.totalComments.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                +8% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Profile Details and Content */}
        <div className="grid gap-6 lg:grid-cols-4">
          {/* Profile Details */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Profile Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">{profile.email}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">{profile.location}</span>
              </div>
              <div className="flex items-center">
                <LinkIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                <a
                  href={`https://${profile.website}`}
                  className="text-sm text-primary hover:underline"
                >
                  {profile.website}
                </a>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">Joined {profile.joinDate}</span>
              </div>

              <Separator className="my-4" />

              <div>
                <h3 className="text-sm font-medium mb-2">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.categories.map((category) => (
                    <Badge key={category} variant="outline">
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content Tabs */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Blog Content</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="published">
                <TabsList className="mb-4">
                  <TabsTrigger value="published">
                    <FileText className="h-4 w-4 mr-2" />
                    Published
                  </TabsTrigger>
                  <TabsTrigger value="drafts">
                    <PenTool className="h-4 w-4 mr-2" />
                    Drafts
                  </TabsTrigger>
                  <TabsTrigger value="comments">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Comments
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="published" className="space-y-4">
                  {profile.posts.map((post) => (
                    <Card key={post.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium text-lg">
                              {post.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {post.excerpt}
                            </p>
                          </div>
                          <Badge>{post.category}</Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-muted-foreground">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>{post.date}</span>
                          </div>
                          <div className="flex items-center">
                            <Eye className="h-3 w-3 mr-1" />
                            <span>{post.views.toLocaleString()} views</span>
                          </div>
                          <div className="flex items-center">
                            <MessageSquare className="h-3 w-3 mr-1" />
                            <span>{post.comments} comments</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{post.readingTime}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="drafts" className="space-y-4">
                  {profile.drafts.length > 0 ? (
                    profile.drafts.map((draft) => (
                      <Card key={draft.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium text-lg">
                                {draft.title}
                              </h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                {draft.excerpt}
                              </p>
                            </div>
                            <Badge variant="outline">{draft.category}</Badge>
                          </div>
                          <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>{draft.date}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{draft.readingTime}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No drafts yet</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="comments" className="space-y-4">
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Recent comments on your posts will appear here</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
