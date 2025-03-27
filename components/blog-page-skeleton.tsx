import { Skeleton } from "@/components/ui/skeleton";

export function BlogPageSkeleton() {
  return (
    <div className="px-4 py-12">
      <div className="flex flex-col gap-6 md:flex-row">
        <div className="md:w-3/4">
          <Skeleton className="h-10 w-48 mb-6" />

          {/* Blog Filters Skeleton */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-28" />
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-9 w-40 ml-auto" />
          </div>

          {/* Blog List Skeleton */}
          <div className="space-y-6">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="border rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <Skeleton className="h-16 w-16 rounded-md" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-20 w-full" />
                    <div className="flex gap-2 pt-2">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Skeleton */}
          <div className="flex justify-center mt-8 gap-2">
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-10" />
          </div>
        </div>

        {/* Sidebar Skeleton */}
        <div className="md:w-1/4">
          <Skeleton className="h-8 w-32 mb-4" />
          <Skeleton className="h-[200px] w-full mb-6 rounded-lg" />

          <Skeleton className="h-8 w-32 mb-4" />
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-6 w-full" />
            ))}
          </div>

          <Skeleton className="h-8 w-32 mt-6 mb-4" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton key={index} className="h-7 w-16" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
