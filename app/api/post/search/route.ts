// app/api/search/route.ts
import Post from "@/models/post.model";
import { connect_DB } from "@/utils/DB";
import { NextResponse } from "next/server";
import { queryVectorDB } from "@/utils/vectorDB";

export async function GET(request: Request) {
  await connect_DB();

  // Extract the search query from URL parameters
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter is required" },
      { status: 400 }
    );
  }

  try {
    // Query the vector DB to get the top 50 nearest records.
    const vectorResponse = await queryVectorDB(query);

    // Assume the vector DB response contains a "matches" property.
    // Extract post IDs from each match.
    const postIds = vectorResponse.matches.map((match: any) => match.id);

    // Fetch posts from MongoDB whose _id is in the postIds array.
    // Optionally, you may want to sort the posts in the same order as in postIds.
    const posts = await Post.find({ _id: { $in: postIds } }).lean();

    return NextResponse.json({ posts }, { status: 200 });
  } catch (error) {
    console.error("Error searching posts:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
