// components/skeleton-featured-posts.tsx
import React from "react";

export const SkeletonFeaturedPosts = () => {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="animate-pulse bg-muted/50 p-6 rounded-lg border border-border"
        >
          <div className="h-40 bg-muted/20 rounded-lg mb-4"></div>
          <div className="h-6 bg-muted/30 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-muted/30 rounded w-1/2 mb-4"></div>
          <div className="h-10 bg-muted/20 rounded w-full"></div>
        </div>
      ))}
    </div>
  );
};
