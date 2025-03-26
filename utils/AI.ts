import { GoogleGenAI } from "@google/genai";
export function filterBackticks(input: string): string {
  // Remove a leading "```json" (with optional whitespace) and trailing triple backticks.
  return input.replace(/^```json\s*|```$/g, "").trim();
}

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
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });
    // Remove leading/trailing backticks if present:
    const cleanedText = filterBackticks(response.text!);
    console.log(cleanedText);
    const result = JSON.parse(cleanedText);
    return result; // Expected shape: { categories: string[], tags: string[] }
  } catch (error) {
    console.error("Error calling Gemini API", error);
    throw new Error("Error calling Gemini API");
  }
};
