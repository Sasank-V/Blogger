"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Edit, Eye, Trash2 } from "lucide-react";
import type { Post } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-toastify";

interface DashboardTabsProps {
  data: Post[];
}

export function DashboardTabs({ data }: DashboardTabsProps) {
  const [posts, setPosts] = useState<Post[]>(data);

  const handleDeletePost = async (postId: string) => {
    try {
      // In a real app, this would be an API call:
      // await fetch(`/api/posts/${postId}`, { method: 'DELETE' })

      // Update local state
      setPosts(posts.filter((post) => post.id || post._id !== postId));

      toast.success("Your post has been deleted successfully.");
    } catch (error) {
      toast.error("Failed to delete the post. Please try again.");
    }
  };

  const publishedPosts = posts.filter((post) => post.isPublished === true);
  const draftPosts = posts.filter((post) => post.isPublished === false);

  // Helper function to safely format a date string
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return isNaN(date.getTime())
      ? "N/A"
      : formatDistanceToNow(date, { addSuffix: true });
  };

  return (
    <Tabs defaultValue="published" className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger value="published">
          Published ({publishedPosts.length})
        </TabsTrigger>
        <TabsTrigger value="drafts">Drafts ({draftPosts.length})</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
      </TabsList>

      <TabsContent value="published">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {publishedPosts.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-6 text-muted-foreground"
                  >
                    You don't have any published posts yet.
                  </TableCell>
                </TableRow>
              ) : (
                publishedPosts.map((post) => (
                  <TableRow key={post.id || post._id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200"
                      >
                        Published
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(post.createdAt)}
                    </TableCell>
                    <TableCell>{post.views.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/blog/${post.slug}`}>
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/dashboard/edit/${post.id || post._id}`}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Link>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete your post and remove it from
                                our servers.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleDeletePost(post.id || post._id)
                                }
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </TabsContent>

      <TabsContent value="drafts">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {draftPosts.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-6 text-muted-foreground"
                  >
                    You don't have any draft posts.
                  </TableCell>
                </TableRow>
              ) : (
                draftPosts.map((post) => (
                  <TableRow key={post.id || post._id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="bg-amber-50 text-amber-700 border-amber-200"
                      >
                        Draft
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(post.updatedAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/dashboard/edit/${post.id || post._id}`}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Link>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete your draft and remove it from
                                our servers.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleDeletePost(post.id || post._id)
                                }
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </TabsContent>

      <TabsContent value="analytics">
        <div className="space-y-8">
          <div className="rounded-md border p-6">
            <h3 className="text-lg font-medium mb-4">Post Performance</h3>
            <div className="h-80 w-full">
              {/* Chart would go here in a real implementation */}
              <div className="flex items-center justify-center h-full bg-muted/30 rounded-md">
                <p className="text-muted-foreground">
                  Post views over time chart would render here
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-md border p-6">
            <h3 className="text-lg font-medium mb-4">Audience Demographics</h3>
            <div className="h-80 w-full">
              {/* Chart would go here in a real implementation */}
              <div className="flex items-center justify-center h-full bg-muted/30 rounded-md">
                <p className="text-muted-foreground">
                  Audience demographics chart would render here
                </p>
              </div>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
