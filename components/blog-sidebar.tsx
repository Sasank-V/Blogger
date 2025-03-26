import Link from "next/link"
import { getCategories, getTags, getPopularPosts } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export async function BlogSidebar() {
  const categories = await getCategories()
  const tags = await getTags()
  const popularPosts = await getPopularPosts(5)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Link key={category.slug} href={`/blog?category=${category.slug}`}>
                <Badge variant="outline" className="hover:bg-secondary">
                  {category.name}
                </Badge>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Popular Tags</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link key={tag.slug} href={`/blog?tag=${tag.slug}`}>
                <Badge variant="secondary" className="hover:bg-secondary/80">
                  {tag.name}
                </Badge>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Popular Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {popularPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="block group">
                <div className="space-y-1">
                  <h4 className="font-medium group-hover:underline line-clamp-2">{post.title}</h4>
                  <p className="text-xs text-muted-foreground">{post.viewCount} views</p>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

