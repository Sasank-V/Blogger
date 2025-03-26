import { pipeline, layer_norm } from "@huggingface/transformers";

let extractor: any = null;

async function initPipeline() {
  if (!extractor) {
    // Use the GPU by setting device: 0 if available; remove { device: 0 } to run on CPU.
    extractor = await pipeline(
      "feature-extraction",
      "nomic-ai/nomic-embed-text-v1.5",
      { device: "cpu" }
    );
  }
}

/**
 * Generates an embedding vector for the given text using the Hugging Face Transformers pipeline.
 * A task-specific prefix can be provided to guide the model.
 *
 * @param text - The input text to generate an embedding for.
 * @param prefix - Optional task-specific prefix. Defaults to "search_query:".
 * @returns A promise that resolves to an array of numbers representing the embedding.
 */
export async function getEmbedding(
  text: string,
  prefix: string = "search_query:"
): Promise<number[]> {
  await initPipeline();

  // Prepend the task-specific prefix to the text
  const inputText = `${prefix} ${text}`;

  // Generate token embeddings using the feature-extraction pipeline with mean pooling
  let embeddings = await extractor([inputText], { pooling: "mean" });

  if (!embeddings || !embeddings.dims) {
    throw new Error("No result returned from feature-extraction pipeline");
  }

  // Get the hidden dimension size (e.g., 768)
  const hiddenSize = embeddings.dims[1];
  // Define the target dimension for the final embedding (e.g., 512)
  const targetDim = 512;

  // Apply layer normalization across the hidden dimension
  embeddings = layer_norm(embeddings, [hiddenSize]);
  // Slice the tensor along the hidden dimension to obtain the first `targetDim` values
  embeddings = embeddings.slice(null, [0, targetDim]);
  // Normalize the sliced embedding along the last axis (L2 normalization)
  embeddings = embeddings.normalize(2, -1);

  // Convert the tensor to a JavaScript array. Assuming a 2D array is returned with one row.
  const result = embeddings.tolist();
  // console.log(result);
  return result[0];
}
