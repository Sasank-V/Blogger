import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Post {
  id: string;
  title: string;
  slug: string;
  viewCount: number;
}

async function fetchPopularPosts(limit: number = 5): Promise<Post[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/post/popular`
    );
    if (!response.ok) throw new Error("Failed to fetch popular posts");

    const data = await response.json();
    return data.posts.map((post: any) => ({
      id: post._id,
      title: post.title,
      slug: post.slug,
      viewCount: post.views,
    }));
  } catch (error) {
    console.error("Error fetching popular posts:", error);
    return [];
  }
}

export default async function BlogSidebar() {
  const popularPosts = await fetchPopularPosts(5);
  console.log("Popular Posts:", popularPosts);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Popular Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {popularPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="block group"
              >
                <div className="space-y-1">
                  <h4 className="font-medium group-hover:underline line-clamp-2">
                    {post.title}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {post.viewCount} views
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
