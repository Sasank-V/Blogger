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
import { Line, Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  ArcElement,
  BarElement,
  BarController,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

// Register required chart elements
ChartJS.register(
  LineElement,
  ArcElement,
  BarElement,
  BarController,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

interface DashboardTabsProps {
  data: Post[];
}

export function DashboardTabs({ data }: DashboardTabsProps) {
  const [posts, setPosts] = useState<Post[]>(data);

  const handleDeletePost = async (postId: string) => {
    try {
      const res = await fetch(`/api/post/${postId}/delete`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete post");
      }

      setPosts(posts.filter((post) => post._id !== postId));
      toast.success("Post deleted successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete the post.");
    }
  };

  const publishedPosts = posts.filter((post) => post.isPublished);
  const draftPosts = posts.filter((post) => !post.isPublished);

  // Format date safely
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return isNaN(date.getTime())
      ? "N/A"
      : formatDistanceToNow(date, { addSuffix: true });
  };

  // Chart: Post Performance (Line Chart)
  const postPerformanceData = {
    labels: publishedPosts.map((post) =>
      new Date(post.createdAt).toLocaleDateString()
    ),
    datasets: [
      {
        label: "Post Views",
        data: publishedPosts.map((post) => post.views || 0),
        backgroundColor: "rgba(59,130,246,0.2)",
        borderColor: "rgba(59,130,246,1)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(59,130,246,1)",
      },
    ],
  };

  // Chart: Audience Demographics (Doughnut Chart)
  const audienceDataChart = {
    labels: ["USA", "India", "UK", "Canada"],
    datasets: [
      {
        label: "Audience",
        data: [40, 30, 20, 10], // Replace with actual data if available
        backgroundColor: ["#6366F1", "#F59E0B", "#EF4444", "#10B981"],
      },
    ],
  };

  // Chart: Post Engagement (Bar Chart)
  const postEngagementData = {
    labels: publishedPosts.map((post) => post.title),
    datasets: [
      {
        label: "Likes",
        data: publishedPosts.map((post) => post.likes || 0),
        backgroundColor: "rgba(34,197,94,0.7)", // Green for likes
        borderColor: "rgba(34,197,94,1)",
        borderWidth: 1,
      },
      {
        label: "Comments",
        data: publishedPosts.map((post) => post.comments || 0),
        backgroundColor: "rgba(239,68,68,0.7)", // Red for comments
        borderColor: "rgba(239,68,68,1)",
        borderWidth: 1,
      },
    ],
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

      {/* Published Posts */}
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
                  <TableCell colSpan={5} className="text-center py-6">
                    No published posts available.
                  </TableCell>
                </TableRow>
              ) : (
                publishedPosts.map((post) => (
                  <TableRow key={post._id}>
                    <TableCell>{post.title}</TableCell>
                    <TableCell>
                      <Badge className="bg-green-50 text-green-700 border-green-200">
                        Published
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(post.createdAt)}</TableCell>
                    <TableCell>{post.views.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/blog/${post._id}/view`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/blog/${post._id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Confirm Delete
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeletePost(post._id)}
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

      {/* Drafts Posts */}
      <TabsContent value="drafts">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {draftPosts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6">
                    No draft posts available.
                  </TableCell>
                </TableRow>
              ) : (
                draftPosts.map((post) => (
                  <TableRow key={post._id}>
                    <TableCell>{post.title}</TableCell>
                    <TableCell>
                      <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">
                        Draft
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(post.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/blog/${post._id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </TabsContent>

      {/* Analytics Tab */}
      <TabsContent value="analytics">
        <div className=" flex justify-evenly mx-6">
          {/* Post Performance (Line Chart) */}
          <div className="rounded-md border p-6">
            <h3 className="text-lg font-medium mb-4">Post Performance</h3>
            <div className="h-80 w-full">
              <Line data={postPerformanceData} />
            </div>
          </div>

          {/* Post Engagement (Bar Chart) */}
          <div className="rounded-md border p-6">
            <h3 className="text-lg font-medium mb-4">Post Engagement</h3>
            <div className="h-80 w-full">
              <Bar data={postEngagementData} />
            </div>
          </div>

          {/* Audience Demographics (Doughnut Chart) */}
        </div>
      </TabsContent>
    </Tabs>
  );
}
