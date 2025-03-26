import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const prevPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;

  return (
    <div className="flex items-center justify-center space-x-2 py-4">
      {/* Previous Page Button */}
      {prevPage ? (
        <Link href={`?page=${prevPage}`} legacyBehavior>
          <Button variant="outline" size="icon" asChild>
            <a>
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous page</span>
            </a>
          </Button>
        </Link>
      ) : (
        <Button variant="outline" size="icon" disabled>
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous page</span>
        </Button>
      )}

      {/* Page Info */}
      <span className="text-sm">
        Page {currentPage} of {totalPages}
      </span>

      {/* Next Page Button */}
      {nextPage ? (
        <Link href={`?page=${nextPage}`} legacyBehavior>
          <Button variant="outline" size="icon" asChild>
            <a>
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next page</span>
            </a>
          </Button>
        </Link>
      ) : (
        <Button variant="outline" size="icon" disabled>
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next page</span>
        </Button>
      )}
    </div>
  );
}
