import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CommentSection } from "@/components/comment-section";
import { RelatedPosts } from "@/components/related-posts";
import { getPostBySlug, getRelatedPosts } from "@/lib/data";

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return {
      title: "Post Not Found",
      description: "The requested blog post could not be found.",
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.coverImage }],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post.id, post.categories[0]);

  return (
    <div className=" px-4 py-12">
      <article className="max-w-4xl mx-auto">
        <div className="space-y-4 text-center mb-8">
          <div className="flex justify-center gap-2">
            {post.categories.map((category) => (
              <Link key={category} href={`/blog?category=${category}`}>
                <Badge>{category}</Badge>
              </Link>
            ))}
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            {post.title}
          </h1>
          <p className="text-xl text-muted-foreground">{post.excerpt}</p>
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={post.author.image} alt={post.author.name} />
                <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start">
                <Link
                  href={`/profile/${post.author.username}`}
                  className="font-medium hover:underline"
                >
                  {post.author.name}
                </Link>
                <time className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(post.publishedAt), {
                    addSuffix: true,
                  })}
                </time>
              </div>
            </div>
            <Separator orientation="vertical" className="h-6" />
            <div className="text-sm text-muted-foreground">
              {post.readingTime} min read
            </div>
          </div>
        </div>

        <div className="relative aspect-video mb-8">
          <Image
            src={post.coverImage || "/placeholder.svg?height=600&width=1200"}
            alt={post.title}
            fill
            className="object-cover rounded-lg"
            priority
          />
        </div>

        <div
          className="prose prose-lg dark:prose-invert max-w-none mb-12"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="flex items-center justify-between py-4 border-t border-b">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="gap-1">
              <Heart className="h-5 w-5" />
              <span>{post.likes}</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-1">
              <MessageCircle className="h-5 w-5" />
              <span>{post.commentCount}</span>
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Bookmark className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <CommentSection postId={post.id} comments={post.comments} />
      </article>

      <div className="max-w-4xl mx-auto mt-16">
        <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
        <RelatedPosts posts={relatedPosts} />
      </div>
    </div>
  );
}
