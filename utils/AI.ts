export const getCategoryClassifyPrompt = (content: string) => {
  return `You are a content categorization and tagging expert. Your task is to analyze the blog post content provided below and suggest appropriate categories and tags. 

    Instructions:
    1. Read and analyze the provided blog post content.
    2. Identify up to 3 main categories that best represent the overarching themes of the post (e.g., "Technology", "Health", "Lifestyle").
    3. Identify between 3 to 7 relevant tags that capture key topics, trends, and specific details from the content.
    4. Ensure that the categories and tags are clear, concise, and in title case.
    5. Format your answer strictly as a JSON object with two keys:
       - "categories": an array of strings.
       - "tags": an array of strings.
    6. Do not include any explanatory text or additional keys.
    
    Blog Post Content:
    ${content}
    `;
};

export const askGemini = async (
  prompt: string
): Promise<{ categories: string[]; tags: string[] }> => {
  const geminiResponse = await fetch(process.env.GEMINI_API_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GEMINI_API_KEY}`,
    },
    body: JSON.stringify({ prompt, max_tokens: 150 }),
  });

  if (!geminiResponse.ok) {
    console.error("Gemini API error:", geminiResponse.statusText);
    throw new Error("Error calling Gemini API");
  }

  // Assume Gemini API returns JSON with a property "response" that is a JSON string.
  const geminiData = await geminiResponse.json();
  const result = JSON.parse(geminiData.response);
  return result; // Expected to be of the shape: { categories: string[], tags: string[] }
};
