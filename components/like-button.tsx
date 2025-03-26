// components/LikeButton.tsx
"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LikeButtonProps {
  postId: string;
  initialLikes: number;
}

export default function LikeButton({ postId, initialLikes }: LikeButtonProps) {
  const [likes, setLikes] = useState<number>(initialLikes);
  const [liked, setLiked] = useState(false);

  const handleLike = async () => {
    try {
      const url = `/api/post/${postId}/${liked ? "dec-like" : "inc-like"}`;
      const res = await fetch(url, { method: "POST" });
      if (!res.ok) throw new Error("Failed to update like");

      // Update likes count and toggle liked state
      setLikes((prev) => (liked ? prev - 1 : prev + 1));
      setLiked(!liked);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className={`gap-1 transition-colors duration-300 ${
        liked ? "text-red-500" : "text-gray-500"
      }`}
      onClick={handleLike}
    >
      <Heart
        className={`h-5 w-5 ${
          liked ? "fill-red-500 animate-bounce" : "fill-none"
        }`}
      />
      <span>{likes}</span>
    </Button>
  );
}
