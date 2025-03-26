import { connect_DB } from "@/utils/DB";
import Post, { IPost } from "@/models/post.model";
import { Types } from "mongoose";

export async function getPopularPosts(limit: number = 5) {
  await connect_DB();

  const posts = await Post.find({ isPublished: true })
    .sort({ likes: -1, views: -1 })
    .limit(limit)
    .select("title slug views _id") // Ensure _id is selected
    .lean();

  return posts.map((post) => ({
    id: (post._id as Types.ObjectId)?.toString(), // Safely cast _id
    title: post.title,
    slug: post.slug,
    viewCount: post.views,
  }));
}
