import Link from "next/link"
import Image from "next/image"
import type { Post } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"

interface RelatedPostsProps {
  posts: Post[]
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) {
    return null
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <Link key={post.id} href={`/blog/${post.slug}`}>
          <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
            <div className="relative h-48">
              <Image
                src={post.coverImage || "/placeholder.svg?height=200&width=400"}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="font-medium line-clamp-2">{post.title}</h3>
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{post.excerpt}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

