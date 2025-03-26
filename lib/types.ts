export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  image?: string;
  bio?: string;
}

export interface Author {
  _id: string;
  username: string;
  email: string;
  avatar: string;
  bio: "";
}

export interface Comment {
  _id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  likes: number;
  author: Author;
}

export interface Post {
  _id: string; // corresponds to Mongo _id
  title: string;
  content: string;
  author: Author; // if populated, it's an object; otherwise, it's the ObjectId as string
  categories: string[];
  tags: string[];
  likes: number;
  views: number;
  isPublished: boolean; // indicates whether the post is published
  commentCount: number;
  images: string[]; // array of image URLs
  createdAt: string; // ISO date string from MongoDB timestamps
  updatedAt: string; // ISO date string from MongoDB timestamps
}

export interface Category {
  name: string;
  slug: string;
  count: number;
}

export interface Tag {
  name: string;
  slug: string;
  count: number;
}

export interface UserStats {
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  engagementRate: number;
  viewsChange: number;
  likesChange: number;
  commentsChange: number;
  engagementChange: number;
}

export interface GetPostsParams {
  category?: string;
  tag?: string;
  page: number;
  limit: number;
  search?: string;
}

export interface GetPostsResponse {
  posts: Post[];
  totalPages: number;
}

export interface UpdatePostData {
  title?: string;
  content?: string;
  categories?: string[];
  tags?: string[];
  images?: string[];
  isPublished?: boolean;
}
