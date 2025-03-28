"use client";

import { useState, useEffect, use } from "react";
import {
  useRouter,
  notFound,
  useSearchParams,
  useParams,
} from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { MessageCircle, Share2, Bookmark } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CommentSection } from "@/components/comment-section";
import { RelatedPosts } from "@/components/related-posts";
import { getPostById, getRelatedPosts } from "@/lib/data";
import type { Post } from "@/lib/types";
import LikeButton from "@/components/like-button";
import { BlogPostSkeleton } from "@/components/post-view-skeleton";

export default function Post() {
  const params = useParams();
  // console.log(params)
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [src, setSrc] = useState(
    "https://imgs.search.brave.com/a9EQT16mZK713_3SenlQxHUVbxa7oqIBt3hryVeKvqI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jb250/ZW50LW1hbmFnZW1l/bnQtZmlsZXMuY2Fu/dmEuY29tL2Nkbi1j/Z2kvaW1hZ2UvZj1h/dXRvLHE9NzAvNTVi/OGRhMjgtNDE0Yy00/N2ViLWI1OGYtNWMw/NTVlNzc2NjBjL21h/Z2ljLXBob3RvX3Jl/c291cmNlc19GcmVl/b25saW5laW1hZ2Vj/b252ZXJ0ZXJfMngu/cG5n"
  );

  useEffect(() => {
    async function fetchData() {
      const fetchedPost = await getPostById(params.slug);
      if (!fetchedPost) {
        notFound();
        return;
      }
      setPost(fetchedPost);

      const fetchedRelated = await getRelatedPosts(fetchedPost._id);
      console.log(fetchedRelated);
      setRelatedPosts(fetchedRelated);
      setLoading(false);
    }
    fetchData();
  }, [params.slug]);

  if (loading || !post) {
    return <BlogPostSkeleton />;
  }

  return (
    <div className="px-4 py-12">
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
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage
                  src={post.author.avatar}
                  alt={post.author.username}
                />
                <AvatarFallback>
                  {post.author.username.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start">
                <Link
                  href={`/profile/${post.author.username}`}
                  className="font-medium hover:underline"
                >
                  {post.author.username}
                </Link>
                <time className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(post.createdAt), {
                    addSuffix: true,
                  })}
                </time>
              </div>
            </div>
            <Separator orientation="vertical" className="h-6" />
            <div className="text-sm text-muted-foreground">{"5"} min read</div>
          </div>
        </div>

        <div className="relative aspect-video mb-8">
          <Image
            src={src}
            alt={post.title}
            fill
            className="object-cover rounded-lg"
            priority
            onError={() =>
              setSrc(
                "https://imgs.search.brave.com/a9EQT16mZK713_3SenlQxHUVbxa7oqIBt3hryVeKvqI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jb250/ZW50LW1hbmFnZW1l/bnQtZmlsZXMuY2Fu/dmEuY29tL2Nkbi1j/Z2kvaW1hZ2UvZj1h/dXRvLHE9NzAvNTVi/OGRhMjgtNDE0Yy00/N2ViLWI1OGYtNWMw/NTVlNzc2NjBjL21h/Z2ljLXBob3RvX3Jl/c291cmNlc19GcmVl/b25saW5laW1hZ2Vj/b252ZXJ0ZXJfMngu/cG5n"
              )
            }
          />
        </div>

        <div
          className="prose prose-lg dark:prose-invert max-w-none mb-12"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="flex items-center justify-between py-4 border-t border-b">
          <div className="flex items-center gap-4">
            {/* LikeButton is a client component that handles toggling like state */}
            <LikeButton postId={post._id} initialLikes={post.likes} />
            <Button
              variant="ghost"
              size="sm"
              className="gap-1"
              onClick={() => router.push(`/blog/${post._id}/view`)}
            >
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

        <CommentSection postId={post._id} />
      </article>
    </div>
  );
}
