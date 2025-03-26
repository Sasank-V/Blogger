import type {
  Post,
  Category,
  Tag,
  UserStats,
  GetPostsParams,
  GetPostsResponse,
} from "@/lib/types";

// Mock data functions
// In a real app, these would fetch data from an API or database

//Done
export async function getPosts({
  featured = false,
  category,
  tag,
  page = 1,
  limit = 10,
}: GetPostsParams): Promise<GetPostsResponse> {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("limit", limit.toString());
  if (category) params.append("category", category);
  if (tag) params.append("tag", tag);

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

export async function getPostBySlug(slug: string): Promise<Post | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  // In a real app, this would fetch the post from an API or database
  if (slug === "not-found") return null;

  return {
    id: "post-1",
    title: "Understanding the Next.js App Router",
    slug,
    excerpt:
      "Learn how the new App Router in Next.js works and how to leverage its power for your applications.",
    content: `
      <p>The App Router is a new paradigm introduced in Next.js 13 that offers a more intuitive and powerful way to handle routing in your applications.</p>
      <h2>Key Features</h2>
      <ul>
        <li>Server Components by default</li>
        <li>Nested layouts</li>
        <li>Simplified data fetching</li>
        <li>Streaming and Suspense</li>
      </ul>
      <p>With the App Router, you can create more complex layouts with less code, and take advantage of React Server Components for improved performance.</p>
      <h2>Getting Started</h2>
      <p>To use the App Router, create an <code>app</code> directory in your project. This directory will contain all your routes, layouts, and pages.</p>
      <p>Each folder represents a route segment, and you can create special files like <code>page.js</code>, <code>layout.js</code>, and <code>loading.js</code> to define the behavior of each route.</p>
      <h2>Conclusion</h2>
      <p>The App Router represents a significant improvement in how we build Next.js applications, offering more flexibility, better performance, and a more intuitive mental model for routing.</p>
    `,
    coverImage:
      "/placeholder.svg?height=600&width=1200&text=Next.js+App+Router",
    author: {
      id: "author-1",
      name: "John Doe",
      username: "johndoe",
      image: "/placeholder.svg?height=40&width=40&text=JD",
    },
    categories: ["Technology", "Web Development"],
    tags: ["nextjs", "react", "javascript"],
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    status: "published",
    likes: 42,
    viewCount: 567,
    commentCount: 8,
    readingTime: 5,
    comments: [
      {
        id: "comment-1",
        content:
          "Great post! I've been using the App Router and it's a game changer.",
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        author: {
          id: "commenter-1",
          name: "Jane Smith",
          username: "janesmith",
          image: "/placeholder.svg?height=40&width=40&text=JS",
        },
        likes: 5,
      },
      {
        id: "comment-2",
        content:
          "Thanks for explaining this so clearly. I was confused about how layouts work but now it makes sense.",
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        author: {
          id: "commenter-2",
          name: "Bob Johnson",
          username: "bobjohnson",
          image: "/placeholder.svg?height=40&width=40&text=BJ",
        },
        likes: 3,
      },
    ],
  };
}

export async function getRelatedPosts(
  postId: string,
  category: string
): Promise<Post[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  // In a real app, this would fetch related posts from an API or database
  return Array.from({ length: 3 }).map((_, i) => ({
    id: `related-${i}`,
    title: `Related Post ${i + 1}`,
    slug: `related-post-${i + 1}`,
    excerpt:
      "This is a related post based on the category or tags of the current post.",
    content:
      "<p>This is a related post based on the category or tags of the current post.</p>",
    coverImage: `/placeholder.svg?height=300&width=500&text=Related+${i + 1}`,
    author: {
      id: "author-2",
      name: "Jane Smith",
      username: "janesmith",
      image: "/placeholder.svg?height=40&width=40&text=JS",
    },
    categories: ["Technology", "Web Development"],
    tags: ["nextjs", "react", "javascript"],
    publishedAt: new Date(Date.now() - (i + 1) * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - (i + 1) * 86400000).toISOString(),
    status: "published",
    likes: Math.floor(Math.random() * 50),
    viewCount: Math.floor(Math.random() * 500),
    commentCount: Math.floor(Math.random() * 10),
    readingTime: Math.floor(Math.random() * 5) + 2,
    comments: [],
  }));
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
