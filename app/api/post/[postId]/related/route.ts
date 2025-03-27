export async function GET(
  request: Request,
  { params }: { params: { postId: string } }
) {
  try {
    await connect_DB();
    const { postId } = params;

    const post = await Post.findById(postId);
    if (!post) {
      return new Response(JSON.stringify({ error: "Post not found" }), {
        status: 404,
      });
    }

    const queryText = post.content;
    const relatedPosts = await queryVectorDB(queryText, 5);

    // ✅ Ensure matches exist before mapping
    if (!relatedPosts || !relatedPosts.matches) {
      return new Response(JSON.stringify({ relatedPosts: [] }), {
        status: 200,
      });
    }

    const relatedPostIds = relatedPosts.matches.map((match: any) => match.id);
    const relatedPostsData = await Post.find({ _id: { $in: relatedPostIds } });

    return new Response(JSON.stringify({ relatedPosts: relatedPostsData }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching related posts:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
