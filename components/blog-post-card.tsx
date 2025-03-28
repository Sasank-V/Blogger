"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import type { Post } from "@/lib/types";
import { useRouter } from "next/navigation";

interface BlogPostCardProps {
  post: Post;
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  const [likes, setLikes] = useState(post.likes);
  const [liked, setLiked] = useState(false);
  const [src, setSrc] = useState(
    "https://imgs.search.brave.com/a9EQT16mZK713_3SenlQxHUVbxa7oqIBt3hryVeKvqI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jb250/ZW50LW1hbmFnZW1l/bnQtZmlsZXMuY2Fu/dmEuY29tL2Nkbi1j/Z2kvaW1hZ2UvZj1h/dXRvLHE9NzAvNTVi/OGRhMjgtNDE0Yy00/N2ViLWI1OGYtNWMw/NTVlNzc2NjBjL21h/Z2ljLXBob3RvX3Jl/c291cmNlc19GcmVl/b25saW5laW1hZ2Vj/b252ZXJ0ZXJfMngu/cG5n"
  );
  const router = useRouter();

  // Toggle Like Function
  const handleLike = async () => {
    try {
      const url = `/api/post/${post._id}/${liked ? "dec-like" : "inc-like"}`;
      const res = await fetch(url, { method: "POST" });

      if (!res.ok) throw new Error("Failed to update like");

      setLikes((prev) => (liked ? prev - 1 : prev + 1));
      setLiked(!liked);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  // Redirect to Post Detail View (on Comment Click)
  const handleCommentClick = () => {
    router.push(`/blog/${post._id}/view`);
  };

  // Share Function
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          url: `${window.location.origin}/blog/${post._id}/view`,
        });
      } catch (error) {
        console.error("Error sharing post:", error);
      }
    } else {
      alert("Sharing not supported on this browser.");
    }
  };

  // console.log(post);

  return (
    <div key={post.id}>
      <Card className="overflow-hidden">
        <div className="relative aspect-video">
          <Image
            src={src}
            alt={post.title}
            fill
            className="object-cover"
            onError={() =>
              setSrc(
                "https://imgs.search.brave.com/a9EQT16mZK713_3SenlQxHUVbxa7oqIBt3hryVeKvqI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jb250/ZW50LW1hbmFnZW1l/bnQtZmlsZXMuY2Fu/dmEuY29tL2Nkbi1j/Z2kvaW1hZ2UvZj1h/dXRvLHE9NzAvNTVi/OGRhMjgtNDE0Yy00/N2ViLWI1OGYtNWMw/NTVlNzc2NjBjL21h/Z2ljLXBob3RvX3Jl/c291cmNlc19GcmVl/b25saW5laW1hZ2Vj/b252ZXJ0ZXJfMngu/cG5n"
              )
            }
          />
        </div>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={post.author.avatar}
                alt={post.author.username}
              />
              <AvatarFallback>{post.author.username.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <Link
                href={`/profile/${post.author._id}`}
                className="text-sm font-medium hover:underline"
              >
                {post.author.username}
              </Link>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(post.updatedAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>
          <Link
            href={`/blog/${post._id}/view`}
            onClick={async () => {
              try {
                await fetch(`/api/post/${post._id}/inc-views`, {
                  method: "GET",
                });
              } catch (error) {
                console.error("Error incrementing views:", error);
              }
            }}
            className="hover:underline"
          >
            <h3 className="text-xl font-bold leading-tight mt-2">
              {post.title}
            </h3>
          </Link>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground line-clamp-3">{post.title}</p>
        </CardContent>
        <CardFooter className="border-t p-4">
          <div className="flex items-center gap-4 text-muted-foreground">
            {/* Like Button with Animation */}
            <Button
              variant="ghost"
              size="sm"
              className={`gap-1 transition-colors duration-300 ${
                liked ? "text-red-500" : "text-gray-500"
              }`}
              onClick={handleLike}
            >
              <Heart
                className={`h-4 w-4 ${
                  liked ? "fill-red-500 animate-bounce" : "fill-none"
                }`}
              />
              <span>{likes}</span>
            </Button>

            {/* Redirect to Post Detail View on Comment Click */}
            <Button
              variant="ghost"
              size="sm"
              className="gap-1"
              onClick={handleCommentClick}
            >
              <MessageCircle className="h-4 w-4" />
              <span>{post.commentCount}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="ml-auto"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
