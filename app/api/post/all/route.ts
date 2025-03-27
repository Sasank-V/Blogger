import { NextResponse } from "next/server";
import { connect_DB } from "@/utils/DB";
import Post from "@/models/post.model";
import { queryVectorDB } from "@/utils/vectorDB";
import "@/models/user.model";

export async function GET(request: Request) {
  await connect_DB();

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const search = searchParams.get("search") || ""; // ✅ Get search query
  const skip = (page - 1) * limit;

  try {
    let posts = [];
    let totalPosts = 0;

    if (search) {
      // Perform vector-based search if a search query is provided
      const vectorResponse = await queryVectorDB(search, limit);
      // console.dir(vectorResponse["result"]["hits"]);

      const postIds =
        vectorResponse["result"]["hits"].map((match: any) => match._id) || [];
      console.log(postIds);
      posts = await Post.find({ _id: { $in: postIds }, isPublished: true })
        .sort({ createdAt: -1 })
        .populate("author", "username avatar bio");

      totalPosts = postIds.length;
    } else {
      // Default search condition (fetch all published posts)
      const query = { isPublished: true };

      posts = await Post.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("author", "username avatar bio");

      totalPosts = await Post.countDocuments(query);
    }

    const totalPages = Math.ceil(totalPosts / limit); // ✅ Correctly calculate totalPages

    return NextResponse.json(
      { posts, page, limit, totalPages, totalPosts }, // ✅ Return totalPages
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
