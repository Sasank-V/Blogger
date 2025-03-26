import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Session } from "next-auth";

interface DashboardHeaderProps {
  user: Session["user"];
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name}. Here&apos;s an overview of your blog.
        </p>
      </div>
      <Button asChild className="mt-4 md:mt-0">
        <Link href="/dashboard/new-post">
          <PlusCircle className="mr-2 h-4 w-4" />
          New Post
        </Link>
      </Button>
    </div>
  );
}
