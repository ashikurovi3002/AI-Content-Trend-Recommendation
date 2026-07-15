import dotenv from "dotenv";
import fs from "fs/promises";
import path from "path";
import aiService from "../services/aiService.js";

// Load environment variables
dotenv.config();

const testGemini = async () => {
  try {
    console.log("🚀 Testing Combined Summary + Recommendation Gemini API integration via @google/genai...");
    
    const promptDir = path.join(process.cwd(), "prompts");
    const template = await fs.readFile(path.join(promptDir, "analyze_content.txt"), "utf8");
    
    const prompt = template
      .replace("{{TITLE}}", "How to Build a Successful AI Startup in 2026")
      .replace("{{DESCRIPTION}}", "A comprehensive guide on launching artificial intelligence companies in the modern tech ecosystem.")
      .replace("{{AUTHOR}}", "John Doe")
      .replace("{{TYPE}}", "website")
      .replace("{{CATEGORY}}", "tech")
      .replace("{{CONTENT}}", "Building an AI startup in 2026 requires understanding the shifts in foundational models, the cost of compute, and how to create proprietary workflow value. Founders must focus on distribution and integration rather than raw model training. Leveraging next-gen tools allows developers to assemble state-of-the-art products rapidly.");

    const result = await aiService.callGemini(prompt);
    console.log("✅ Success! Response received from Gemini:");
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("❌ Failed to contact Gemini API:", error);
  }
};

testGemini();
