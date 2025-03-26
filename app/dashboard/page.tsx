"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardStats } from "@/components/dashboard-stats";
import { DashboardTabs } from "@/components/dashboard-tabs";
import { getUserStats, getUserPosts } from "@/lib/data";
import type { UserStats, Post } from "@/lib/types";
import { DashboardPageSkeleton } from "@/components/dashboard-page-skeleton";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [stats, setStats] = useState<UserStats | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    if (!session || !session.user || !session.user.id) {
      toast.warn("Please sign in to see your dashboard.");
      router.push("/");
      return;
    }

    async function fetchDashboardData() {
      try {
        const userId = session.user.id;
        const statsData = await getUserStats(userId);
        const postsData = await getUserPosts(userId);

        // Fetch drafts from localStorage (if any)
        let draftPosts: Post[] = [];
        if (typeof window !== "undefined") {
          const draftsRaw = localStorage.getItem(`draft-${userId}`);
          if (draftsRaw) {
            try {
              const parsed = JSON.parse(draftsRaw);
              // If parsed data is an array, use it; if it's an object, wrap it in an array.
              draftPosts = Array.isArray(parsed) ? parsed : [parsed];
              // Add draft status to distinguish them from published posts
              draftPosts = draftPosts.map((draft) => ({
                ...draft,
                isDraft: true,
              }));
            } catch (error) {
              console.error("Error parsing draft posts:", error);
            }
          }
        }

        // Merge drafts with published posts (drafts come first)
        const combinedPosts = [...draftPosts, ...postsData];
        setStats(statsData);
        setPosts(combinedPosts);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [session, status, router]);

  if (loading) {
    return <DashboardPageSkeleton />;
  }

  return (
    <div className="px-4 py-12">
      <DashboardHeader user={session!.user} />
      <DashboardStats stats={stats!} userId={session.user.id} />
      <DashboardTabs data={posts} />
    </div>
  );
}
