// utils/vectorDB.ts
import { Pinecone } from "@pinecone-database/pinecone";

const apiKey = process.env.PINECONE_API_KEY;
const indexName = process.env.PINECONE_INDEX;
const indexHost = process.env.PINECONE_HOST;

if (!apiKey) {
  throw new Error("PINECONE_API_KEY is not defined in environment variables");
}
if (!indexName || indexName.trim() === "") {
  throw new Error(
    "NEXT_PUBLIC_PINECONE_INDEX is not defined in environment variables"
  );
}
if (!indexHost || indexHost.trim() === "") {
  throw new Error(
    "NEXT_PUBLIC_PINECONE_HOST is not defined in environment variables"
  );
}

const pc = new Pinecone({ apiKey });

/**
 * Upserts a record (embedding vector) for a post into the Pinecone index.
 *
 * @param postId - The unique identifier for the post.
 * @param embedding - An array of numbers representing the embedding.
 * @param text - The text used to generate the embedding; must be provided to satisfy the field mapping.
 * @param namespaceName - The namespace within the index (default: "blog-posts").
 */
export async function upsertVectorDB(
  postId: string,
  embedding: number[],
  text: string,
  namespaceName: string = "blog-posts"
): Promise<void> {
  const ns = pc.index(indexName, indexHost).namespace(namespaceName);
  const records = [
    {
      id: postId,
      values: embedding.map((num) => num + ""),
      text,
      metadata: JSON.stringify({ source: "blog-post" }),
    },
  ];
  await ns.upsertRecords(records);
}

export async function queryVectorDB(
  queryText: string,
  topK: number = 5, // Default to 5 results
  namespaceName: string = "blog-posts"
): Promise<any> {
  const ns = pc.index(indexName, indexHost).namespace(namespaceName);

  // Perform the search query with customizable topK value
  const response = await ns.searchRecords({
    query: {
      topK,
      inputs: { text: queryText },
    },
    fields: ["text", "metadata"],
  });

  return response;
}

export async function deleteVectorDBRecord(
  postId: string,
  namespaceName: string = "blog-posts"
): Promise<void> {
  const ns = pc.index(indexName, indexHost).namespace(namespaceName);
  await ns.deleteOne(postId);
}

/**
 * Deletes multiple records from the Pinecone index by their postIds.
 *
 * @param postIds - An array of post identifiers to delete.
 * @param namespaceName - The namespace within the index (default: "blog-posts").
 */
export async function deleteVectorDBRecords(
  postIds: string[],
  namespaceName: string = "blog-posts"
): Promise<void> {
  const ns = pc.index(indexName, indexHost).namespace(namespaceName);
  await ns.deleteMany(postIds);
}
