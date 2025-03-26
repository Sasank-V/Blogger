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
        setStats(statsData);
        setPosts(postsData);
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
    return <div>Loading dashboard...</div>;
  }

  return (
    <div className="px-4 py-12">
      <DashboardHeader user={session!.user} />
      <DashboardStats stats={stats!} />
      <DashboardTabs data={posts} />
    </div>
  );
}
