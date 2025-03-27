"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { debounce } from "lodash";

export function BlogFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [dateFilter, setDateFilter] = useState(searchParams.get("date") || "");

  // Debounce search to avoid rapid updates
  const updateSearchParams = debounce(() => {
    const params = new URLSearchParams(window.location.search);

    if (searchQuery) {
      params.set("search", searchQuery);
    } else {
      params.delete("search");
    }

    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }

    if (dateFilter) {
      params.set("date", dateFilter);
    } else {
      params.delete("date");
    }

    console.log("searchQuery", searchQuery);
    console.log("params", params.toString());

    router.replace(`/blog?${params.toString()}`);
  }, 500);

  useEffect(() => {
    updateSearchParams();
    return () => updateSearchParams.cancel();
  }, [searchQuery, category, dateFilter]);

  const clearFilters = () => {
    setSearchQuery("");
    setCategory("");
    setDateFilter("");
    router.push("/blog?query");
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      {/* Search Input */}
      <div className="relative w-full sm:max-w-xs">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search posts..."
          className="pl-8 w-full"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            console.log("run search");
          }} // ✅ Fixed here
        />
      </div>

      {searchQuery && (
        <button onClick={clearFilters} className="text-sm text-red-500">
          Clear Search
        </button>
      )}
    </div>
  );
}
