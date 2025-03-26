import { Skeleton } from "@/components/ui/skeleton";

export function ProfilePageSkeleton() {
  return (
    <div className="container mx-auto py-8 px-4">
      {/* Theme Toggle Skeleton */}
      <div className="flex justify-end mb-4">
        <Skeleton className="h-10 w-10 rounded-md" />
      </div>

      <div className="grid gap-6">
        {/* Profile Header Skeleton */}
        <div className="border rounded-lg p-6">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <Skeleton className="h-24 w-24 rounded-full" />

            <div className="flex-1 text-center md:text-left">
              <Skeleton className="h-8 w-48 mx-auto md:mx-0 mb-2" />
              <Skeleton className="h-5 w-32 mx-auto md:mx-0 mb-4" />
              <Skeleton className="h-16 w-full max-w-md mx-auto md:mx-0 mb-4" />

              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={index} className="h-6 w-20" />
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Skeleton className="h-9 w-28" />
              <Skeleton className="h-9 w-9" />
            </div>
          </div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </div>
              <Skeleton className="h-8 w-20 mb-1" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </div>

        {/* Profile Details and Content Skeleton */}
        <div className="grid gap-6 lg:grid-cols-4">
          {/* Profile Details Skeleton */}
          <div className="border rounded-lg p-4 lg:col-span-1">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex items-center">
                  <Skeleton className="h-4 w-4 mr-2" />
                  <Skeleton className="h-5 w-full" />
                </div>
              ))}

              <Skeleton className="h-1 w-full my-4" />

              <Skeleton className="h-5 w-24 mb-2" />
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={index} className="h-6 w-20" />
                ))}
              </div>
            </div>
          </div>

          {/* Content Tabs Skeleton */}
          <div className="border rounded-lg p-4 lg:col-span-3">
            <Skeleton className="h-6 w-32 mb-4" />

            <div className="mb-4">
              <div className="flex gap-2">
                <Skeleton className="h-10 w-28" />
                <Skeleton className="h-10 w-28" />
                <Skeleton className="h-10 w-28" />
              </div>
            </div>

            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full mb-1" />
                      <Skeleton className="h-4 w-full mb-1" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                    <Skeleton className="h-6 w-20" />
                  </div>
                  <div className="flex flex-wrap items-center gap-4 mt-4">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
