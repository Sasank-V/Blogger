import { Suspense } from "react";
import type { Metadata } from "next";
import { BlogList } from "@/components/blog-list";
import BlogSidebar from "@/components/blog-sidebar";
import { BlogFilters } from "@/components/blog-filters";
import { BlogListSkeleton } from "@/components/blog-list-skeleton";

export const metadata: Metadata = {
  title: "Blog | Modern Blogging Platform",
  description:
    "Explore our collection of articles and stories from writers around the world.",
};

interface BlogPageProps {
  searchParams: {
    category?: string;
    tag?: string;
    page?: string;
  };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  // Await the searchParams object
  const resolvedSearchParams = await Promise.resolve(searchParams);

  const category = resolvedSearchParams.category;
  const tag = resolvedSearchParams.tag;
  const page = Number(resolvedSearchParams.page) || 1;

  return (
    <div className="px-4 py-12">
      <div className="flex flex-col gap-6 md:flex-row">
        <div className="md:w-3/4">
          <h1 className="text-3xl font-bold mb-6">Blog Posts</h1>
          <BlogFilters />
          <Suspense fallback={<BlogListSkeleton />}>
            <BlogList category={category} tag={tag} page={page} />
          </Suspense>
        </div>
        <div className="md:w-1/4">
          <BlogSidebar />
        </div>
      </div>
    </div>
  );
}
