"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  MapPin,
  Calendar,
  LinkIcon,
  Edit,
  Settings,
  Image,
  FileText,
  BookOpen,
} from "lucide-react";

interface UserProfile {
  name: string;
  username: string;
  avatar: string;
  bio: string;
  email: string;
  location: string;
  website: string;
  joinDate: string;
  followers: number;
  following: number;
  posts: number;
  interests: string[];
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching profile data
    setTimeout(() => {
      setProfile({
        name: "Alex Johnson",
        username: "@alexjohnson",
        avatar: "/placeholder.svg?height=128&width=128",
        bio: "Digital content creator and web developer passionate about creating engaging user experiences.",
        email: "alex.johnson@example.com",
        location: "San Francisco, CA",
        website: "alexjohnson.dev",
        joinDate: "January 2022",
        followers: 1248,
        following: 567,
        posts: 42,
        interests: ["Web Development", "UI/UX Design", "Photography", "Tech"],
      });
      setLoading(false);
    }, 1000);
  }, []);

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
                  {profile.interests.map((interest) => (
                    <Badge key={interest} variant="secondary">
                      {interest}
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
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Followers</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {profile.followers.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Following</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {profile.following.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                +5% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Posts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {profile.posts.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">+3 new this month</p>
            </CardContent>
          </Card>
        </div>

        {/* Profile Details and Content */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Profile Details */}
          <Card className="md:col-span-1">
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
            </CardContent>
          </Card>

          {/* Content Tabs */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Content</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="posts">
                <TabsList className="mb-4">
                  <TabsTrigger value="posts">
                    <FileText className="h-4 w-4 mr-2" />
                    Posts
                  </TabsTrigger>
                  <TabsTrigger value="media">
                    <Image className="h-4 w-4 mr-2" />
                    Media
                  </TabsTrigger>
                  <TabsTrigger value="saved">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Saved
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="posts" className="space-y-4">
                  {[1, 2, 3].map((post) => (
                    <div key={post} className="p-4 border rounded-lg">
                      <h3 className="font-medium">Sample Post Title {post}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        This is a preview of post content that would appear in
                        the feed.
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>2 days ago</span>
                        <span>24 likes</span>
                        <span>8 comments</span>
                      </div>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent
                  value="media"
                  className="grid grid-cols-2 md:grid-cols-3 gap-4"
                >
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div
                      key={item}
                      className="aspect-square bg-muted rounded-md overflow-hidden relative"
                    >
                      <img
                        src={`/placeholder.svg?height=200&width=200&text=Image+${item}`}
                        alt={`Media item ${item}`}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="saved" className="space-y-4">
                  <p className="text-center text-muted-foreground py-8">
                    No saved items yet
                  </p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
