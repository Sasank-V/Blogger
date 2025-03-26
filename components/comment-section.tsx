"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";
import type { Comment } from "@/lib/types";

import { getPostCommentsByID } from "@/lib/data";
import { useSession } from "next-auth/react";

interface CommentSectionProps {
  postId: string;
}

export function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    async function fetchComments() {
      try {
        const fetchedComments = await getPostCommentsByID(postId);
        setComments(fetchedComments);
      } catch (err) {
        console.error(err);
        setError("Failed to load comments.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchComments();
  }, [postId]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!commentText.trim()) return;

    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/post/${postId}/comments/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author: session?.user.id,
          content: commentText,
          parentComment: null,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to post comment");
      }
      const data = await res.json();
      // Assuming the API returns { message: string, comment: Comment }
      const newComment: Comment = data.comment;
      setComments([newComment, ...comments]);
      setCommentText("");
      toast.success("Your comment has been published successfully.");
    } catch (error) {
      console.error(error);
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

      {isLoading ? (
        <p>Loading comments...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : comments.length === 0 ? (
        <p className="text-gray-500">No comments yet. Be the first!</p>
      ) : (
        <div className="space-y-6">
          {comments.map((comment, index) => (
            <div key={comment._id} className="flex gap-4">
              <Avatar>
                <AvatarImage
                  src={comment.author.avatar}
                  alt={comment.author.username}
                />
                <AvatarFallback>
                  {comment.author.username.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{comment.author.username}</span>
                  <span className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                <p className="text-sm">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
