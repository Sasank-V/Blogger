import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import type { Post } from "@/lib/types";

interface BlogPostCardProps {
  post: Post;
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <Card className="overflow-hidden" key={post.id}>
      <div className="relative aspect-video">
        <Image
          src={post.images[0] || "/placeholder.svg?height=300&width=600"}
          alt={post.title}
          fill
          className="object-cover"
        />
      </div>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={post.author.avatar} alt={post.author.username} />
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
        <Link href={`/blog/${post.id}`} className="hover:underline">
          <h3 className="text-xl font-bold leading-tight mt-2">{post.title}</h3>
        </Link>
        <div className="flex flex-wrap gap-2">
          {post.categories.map((category) => (
            <Badge key={category} variant="secondary">
              {category}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground line-clamp-3">{post.title}</p>
      </CardContent>
      <CardFooter className="border-t p-4">
        <div className="flex items-center gap-4 text-muted-foreground">
          <Button variant="ghost" size="sm" className="gap-1">
            <Heart className="h-4 w-4" />
            <span>{post.likes}</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-1">
            <MessageCircle className="h-4 w-4" />
            <span>{post.commentCount}</span>
          </Button>
          <Button variant="ghost" size="sm" className="ml-auto">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
