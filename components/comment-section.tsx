"use client";

import React, { useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { Comment } from "@/lib/types";
import { toast } from "react-toastify";

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
}

export function CommentSection({
  postId,
  comments: initialComments,
}: CommentSectionProps) {
  const [comments, setComments] = useState(initialComments);
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!commentText.trim()) return;

    setIsSubmitting(true);

    try {
      // In a real app, this would be an API call.
      // For now, simulate API response:
      const newComment: Comment = {
        id: `temp-${Date.now()}`,
        content: commentText,
        createdAt: new Date().toISOString(),
        author: {
          id: "current-user",
          name: "Current User",
          username: "currentuser",
          image: "/placeholder.svg?height=40&width=40",
        },
        likes: 0,
      };

      setComments([newComment, ...comments]);
      setCommentText("");
      toast.success("Your comment has been published successfully.");
    } catch (error) {
      toast.error("Failed to post your comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-bold mb-6">Comments ({comments.length})</h3>

      <form onSubmit={handleSubmitComment} className="mb-8">
        <Textarea
          placeholder="Share your thoughts..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="mb-4 min-h-[100px]"
        />
        <Button type="submit" disabled={isSubmitting || !commentText.trim()}>
          {isSubmitting ? "Posting..." : "Post Comment"}
        </Button>
      </form>

      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-4">
            <Avatar>
              <AvatarImage
                src={comment.author.image}
                alt={comment.author.name}
              />
              <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium">{comment.author.name}</span>
                <span className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(comment.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
              <p className="text-sm">{comment.content}</p>
              <div className="mt-2">
                <Button variant="ghost" size="sm">
                  Like ({comment.likes})
                </Button>
                <Button variant="ghost" size="sm">
                  Reply
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
