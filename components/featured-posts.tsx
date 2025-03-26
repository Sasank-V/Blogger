import { BlogPostCard } from "@/components/blog-post-card";
import type { Post } from "@/lib/types";

interface FeaturedPostsProps {
  posts: Post[];
}

export function FeaturedPosts({ posts }: FeaturedPostsProps) {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
          Featured Posts
        </h2>
        <p className="text-muted-foreground">
          Discover the most engaging content from our writers.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts &&
          posts.map(
            (post) => post && <BlogPostCard key={post._id} post={post} />
          )}
      </div>
    </div>
  );
}
