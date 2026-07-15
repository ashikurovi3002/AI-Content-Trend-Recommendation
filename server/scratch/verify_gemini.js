import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const testGemini = async () => {
  try {
    console.log("🚀 Testing Creator Studio 'Generate Everything' tool via @google/genai...");
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined in the environment variables");
    }
    
    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `You are a world-class creator. Write a Content Kit in the format of: Generate_Everything.
Source: "Claude Code is a command line tool that helps developers write, edit, and audit code inside their local terminals."

Please compile the following assets separated by headers:
- 3 Viral Titles
- 3 Thumbnail Text options
- A YouTube description
- A brief Facebook Post draft
- A Twitter thread (tweets separated by '---')

Return ONLY the markdown text.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.7
      }
    });

    console.log("✅ Success! Generated master content kit:");
    console.log(response.text);
  } catch (error) {
    console.error("❌ Failed to run studio generation:", error);
  }
};

testGemini();
