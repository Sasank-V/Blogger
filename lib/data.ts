import type {
  Post,
  Category,
  Tag,
  UserStats,
  GetPostsParams,
  GetPostsResponse,
  Comment,
} from "@/lib/types";

// Mock data functions
// In a real app, these would fetch data from an API or database

//Done
export async function getPosts({
  featured = false,
  category,
  tag,
  search, // Ensure search is included
  page = 1,
  limit = 10,
}: GetPostsParams): Promise<GetPostsResponse> {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("limit", limit.toString());
  if (category) params.append("category", category);
  if (tag) params.append("tag", tag);
  if (search) params.append("search", search); // ✅ Add search here

  // Use an absolute URL by prepending the base URL
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/post/all?${params.toString()}`);

  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }

  return res.json();
}

//Done
export async function getUserStats(userId: string): Promise<UserStats> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/user/${userId}/stats`);

  if (!res.ok) {
    throw new Error("Failed to fetch user stats");
  }

  const data: UserStats = await res.json();
  return data;
}

//Done
export async function getUserPosts(userId: string): Promise<Post[]> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/user/${userId}/posts`);

  if (!res.ok) {
    throw new Error("Failed to fetch user posts");
  }

  const data = await res.json();
  return data.posts; // assuming the API returns { posts: Post[] }
}

//Done
export async function getPostById(postId: string): Promise<Post | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/post/${postId}/get`
    );
    if (!res.ok) {
      console.error("Failed to fetch post data");
      return null;
    }
    const post: Post = await res.json();
    return post;
  } catch (error) {
    console.error("Error fetching post by id:", error);
    return null;
  }
}

//Done
export async function getPostCommentsByID(postId: string): Promise<Comment[]> {
  const res = await fetch(`/api/post/${postId}/comments/get`);
  if (!res.ok) {
    throw new Error("Failed to fetch comments");
  }
  const data = await res.json();
  return data.comments; // assuming the API returns { comments: Comment[] }
}

//Done
export async function updatePost(
  postId: string,
  updates: UpdatePostData
): Promise<{ message: string; post?: any; error?: string }> {
  try {
    const response = await fetch(`/api/post/${postId}/update`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to update post");
    }

    return data;
  } catch (error) {
    return { message: "Error updating post", error: (error as Error).message };
  }
}

//Done
export async function getRelatedPosts(postId: string): Promise<Post[]> {
  try {
    const response = await fetch(`/api/post/${postId}/related`);

    if (!response.ok) {
      throw new Error(`Failed to fetch related posts: ${response.statusText}`);
    }

    const data = await response.json();

    // Ensure data structure is correct before returning
    if (!data.relatedPosts || !Array.isArray(data.relatedPosts)) {
      throw new Error("Invalid response structure");
    }

    return data.relatedPosts as Post[];
  } catch (error) {
    console.error("Error fetching related posts:", error);
    return [];
  }
}

export async function getCategories(): Promise<Category[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  // In a real app, this would fetch categories from an API or database
  return [
    { name: "Technology", slug: "technology", count: 12 },
    { name: "Web Development", slug: "web-development", count: 8 },
    { name: "Design", slug: "design", count: 5 },
    { name: "Business", slug: "business", count: 4 },
    { name: "Lifestyle", slug: "lifestyle", count: 7 },
  ];
}

export async function getTags(): Promise<Tag[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  // In a real app, this would fetch tags from an API or database
  return [
    { name: "Next.js", slug: "nextjs", count: 15 },
    { name: "React", slug: "react", count: 20 },
    { name: "JavaScript", slug: "javascript", count: 25 },
    { name: "TypeScript", slug: "typescript", count: 10 },
    { name: "CSS", slug: "css", count: 8 },
    { name: "Tailwind", slug: "tailwind", count: 12 },
    { name: "UI/UX", slug: "ui-ux", count: 6 },
  ];
}

export async function getPopularPosts(limit = 5): Promise<Post[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  // In a real app, this would fetch popular posts from an API or database
  return Array.from({ length: limit }).map((_, i) => ({
    id: `popular-${i}`,
    title: `Popular Post ${i + 1}`,
    slug: `popular-post-${i + 1}`,
    excerpt: "This is a popular post with many views and engagement.",
    content: "<p>This is a popular post with many views and engagement.</p>",
    coverImage: `/placeholder.svg?height=300&width=500&text=Popular+${i + 1}`,
    author: {
      id: "author-1",
      name: "John Doe",
      username: "johndoe",
      image: "/placeholder.svg?height=40&width=40&text=JD",
    },
    categories: ["Technology"],
    tags: ["nextjs"],
    publishedAt: new Date(Date.now() - i * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - i * 86400000).toISOString(),
    status: "published",
    likes: 100 - i * 10,
    viewCount: 1000 - i * 100,
    commentCount: 20 - i * 2,
    readingTime: 4,
    comments: [],
  }));
}

export async function getCurrentUser() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  // In a real app, this would fetch the current user from an API or auth service
  return {
    id: "user-1",
    name: "Current User",
    username: "currentuser",
    email: "user@example.com",
    image: "/placeholder.svg?height=40&width=40&text=CU",
    bio: "I'm a content creator passionate about web development and technology.",
  };
}
