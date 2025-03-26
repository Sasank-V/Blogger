import { getPosts } from "@/lib/data";
import { BlogPostCard } from "@/components/blog-post-card";
import { Pagination } from "@/components/pagination";

interface BlogListProps {
  category?: string;
  tag?: string;
  page: number;
}

export async function BlogList({ category, tag, page }: BlogListProps) {
  const { posts, totalPages } = await getPosts({
    category,
    tag,
    page,
    limit: 9,
  });

  if (posts.length === 0) {
    return (
      <div className="text-center py-12" key={page * 10}>
        <h3 className="text-xl font-medium">No posts found</h3>
        <p className="text-muted-foreground mt-2">
          Try changing your filters or check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts && posts.map((post) => <BlogPostCard post={post} />)}
      </div>
      <Pagination currentPage={page} totalPages={totalPages} />
    </div>
  );
}
