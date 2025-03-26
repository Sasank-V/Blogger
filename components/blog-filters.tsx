"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export function BlogFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams)
    if (searchQuery) {
      params.set("search", searchQuery)
    } else {
      params.delete("search")
    }
    router.push(`/blog?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push("/blog")
    setSearchQuery("")
  }

  const hasFilters = Array.from(searchParams.entries()).length > 0

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <form onSubmit={handleSearch} className="relative w-full sm:max-w-xs">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search posts..."
          className="pl-8 w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </form>

      <div className="flex items-center gap-2 self-end sm:self-auto">
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="mr-2 h-4 w-4" />
            Clear filters
          </Button>
        )}

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filter Posts</SheetTitle>
              <SheetDescription>Narrow down posts by applying filters</SheetDescription>
            </SheetHeader>
            <div className="grid gap-6 py-6">
              <div className="space-y-2">
                <Label htmlFor="sort">Sort by</Label>
                <Select defaultValue="newest">
                  <SelectTrigger id="sort">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest first</SelectItem>
                    <SelectItem value="oldest">Oldest first</SelectItem>
                    <SelectItem value="popular">Most popular</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label>Categories</Label>
                <div className="grid gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="technology" />
                    <label
                      htmlFor="technology"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Technology
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="lifestyle" />
                    <label
                      htmlFor="lifestyle"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Lifestyle
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="travel" />
                    <label
                      htmlFor="travel"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Travel
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="food" />
                    <label
                      htmlFor="food"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Food
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Date</Label>
                <div className="grid gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="last-day" />
                    <label
                      htmlFor="last-day"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Last 24 hours
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="last-week" />
                    <label
                      htmlFor="last-week"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Last week
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="last-month" />
                    <label
                      htmlFor="last-month"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Last month
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="last-year" />
                    <label
                      htmlFor="last-year"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Last year
                    </label>
                  </div>
                </div>
              </div>

              <Button className="w-full">Apply Filters</Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}

