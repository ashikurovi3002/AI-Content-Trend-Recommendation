import fs from "fs/promises";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import ContentItem from "../models/ContentItem.js";
import Summary from "../models/Summary.js";
import Recommendation from "../models/Recommendation.js";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let aiClient = null;
const getAIClient = () => {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined in the environment variables");
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
};

/**
 * Service to process scraped article content using Google Gemini API.
 */
class AIService {
  /**
   * Cleans raw text input by normalizing whitespace and removing garbage bytes.
   * @param {string} text - Raw input text
   * @returns {string} Sanitized text
   */
  cleanText(text) {
    if (!text) return "";
    return text
      .replace(/[\r\n]+/g, "\n") // normalize line breaks
      .replace(/\s+/g, " ") // shrink spaces
      .trim();
  }

  /**
   * Split long text into manageable overlapping chunks (Map-Reduce pipeline).
   * @param {string} text - Cleaned source text
   * @param {number} maxChars - Maximum characters per chunk
   * @param {number} overlap - Overlapping character margin
   * @returns {Array<string>} Array of text chunks
   */
  chunkText(text, maxChars = 6000, overlap = 500) {
    const chunks = [];
    let index = 0;

    while (index < text.length) {
      // Extract chunk
      let chunk = text.substring(index, index + maxChars);
      chunks.push(chunk);

      // Increment by max characters minus overlap to keep context continuous
      index += maxChars - overlap;

      // Safe guard against infinite loops
      if (maxChars - overlap <= 0) break;
    }

    return chunks;
  }

  /**
   * Makes a call to Google Gemini 2.5 Flash API using the official SDK with exponential backoff retries.
   * @param {string} promptText - Prompt content
   * @param {number} retries - Maximum retries
   * @param {number} baseDelay - Delay multiplier in milliseconds
   * @returns {Promise<object>} Parsed JSON response
   */
  async callGemini(promptText, retries = 3, baseDelay = 3000) {
    console.log("Prompt length:", promptText.length);
    const ai = getAIClient();

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: promptText,
          config: {
            responseMimeType: "application/json",
            temperature: 0.3,
          },
        });

        let text = response.text;

        if (!text) {
          throw new Error("Gemini returned an empty response.");
        }

        text = text
          .replace(/^```json/, "")
          .replace(/```$/, "")
          .trim();

        return JSON.parse(text);
      } catch (error) {
        console.error(`⚠️ Gemini API request attempt ${attempt} failed:`, error.message || error);
        if (error.status) console.log("Status:", error.status);
        if (error.errorDetails) console.log("Details:", JSON.stringify(error.errorDetails, null, 2));

        if (attempt === retries) {
          throw error;
        }

        let delay = baseDelay * attempt;

        // Try to parse dynamic retry delay recommended by Google's RetryInfo metadata
        const details = error.errorDetails || error.details;
        if (details && Array.isArray(details)) {
          const retryInfo = details.find(
            (d) => d["@type"]?.includes("RetryInfo") || d["type"]?.includes("RetryInfo")
          );
          if (retryInfo && retryInfo.retryDelay) {
            const seconds = parseFloat(retryInfo.retryDelay);
            if (!isNaN(seconds)) {
              delay = seconds * 1000;
              console.log(`⏰ Google API requested a specific backoff delay: ${retryInfo.retryDelay} -> parsed to ${delay}ms`);
            }
          }
        }

        console.log(`⏰ Retrying Gemini call in ${delay}ms...`);
        await sleep(delay);
      }
    }
  }

  /**
   * Main process pipeline for summarizing and tagging content items.
   * @param {string} contentItemId - Target ContentItem MongoDB ID
   * @returns {Promise<object>} Generated Summary document
   */
  async processContentItem(contentItemId) {
    console.log(`🧠 AI Processing triggered for content: ${contentItemId}`);

    console.log(`🧠 AI Processing triggered for content: ${contentItemId}`);

    const contentItem = await ContentItem.findById(contentItemId).populate("sourceId");
    if (!contentItem) {
      throw new Error(`ContentItem not found: ${contentItemId}`);
    }

    // Set processing status
    contentItem.processedStatus = "processing";
    await contentItem.save();

    try {
      // 1. Clean Text
      const cleaned = this.cleanText(contentItem.rawText || contentItem.description);

      // 2. Load prompts from filesystem (never hardcode prompts)
      const promptDir = path.join(process.cwd(), "prompts");
      const analyzePromptTpl = await fs.readFile(path.join(promptDir, "analyze_content.txt"), "utf8");

      let finalAnalysisJson = null;

      // 3. Chunking check
      const chunks = this.chunkText(cleaned, 6000, 500);

      if (chunks.length <= 1) {
        console.log("👉 Single chunk processing...");
        // Replace templates
        const prompt = analyzePromptTpl
          .replace("{{TITLE}}", contentItem.title)
          .replace("{{DESCRIPTION}}", contentItem.description || "")
          .replace("{{AUTHOR}}", contentItem.author || "Unknown")
          .replace("{{TYPE}}", contentItem.sourceId?.type || "website")
          .replace("{{CATEGORY}}", contentItem.sourceId?.category || "general")
          .replace("{{CONTENT}}", cleaned.substring(0, 5000));

        finalAnalysisJson = await this.callGemini(prompt);
      } else {
        console.log(`👉 Multi-chunk processing (${chunks.length} chunks mapped)...`);
        const chunkPromptTpl = await fs.readFile(
          path.join(promptDir, "summarize_chunk.txt"),
          "utf8"
        );
        const chunkSummaries = [];
        const combinedTopics = new Set();
        const combinedKeywords = new Set();

        // Map: Process chunks in parallel (with slight delay to avoid quick 429s)
        for (let i = 0; i < chunks.length; i++) {
          const chunkPrompt = chunkPromptTpl
            .replace("{{TITLE}}", contentItem.title)
            .replace("{{CONTENT}}", chunks[i]);

          try {
            const chunkResult = await this.callGemini(chunkPrompt);
            if (chunkResult.summary) chunkSummaries.push(chunkResult.summary);
            if (Array.isArray(chunkResult.topics))
              chunkResult.topics.forEach((t) => combinedTopics.add(t));
            if (Array.isArray(chunkResult.keywords))
              chunkResult.keywords.forEach((k) => combinedKeywords.add(k));

            await sleep(500); // polite rate spacing
          } catch (chunkErr) {
            console.warn(`⚠️ Warning: Chunk ${i} mapping failed: ${chunkErr.message}`);
          }
        }

        // Reduce: Merge chunk summaries and compile final metadata report
        const consolidatedText = `Combined segment summaries:\n${chunkSummaries.join("\n\n")}\n\nMerged topics: ${Array.from(combinedTopics).join(", ")}\nMerged keywords: ${Array.from(combinedKeywords).join(", ")}`;

        const finalPrompt = analyzePromptTpl
          .replace("{{TITLE}}", contentItem.title)
          .replace("{{DESCRIPTION}}", contentItem.description || "")
          .replace("{{AUTHOR}}", contentItem.author || "Unknown")
          .replace("{{TYPE}}", contentItem.sourceId?.type || "website")
          .replace("{{CATEGORY}}", contentItem.sourceId?.category || "general")
          .replace("{{CONTENT}}", consolidatedText);

        finalAnalysisJson = await this.callGemini(finalPrompt);
      }

      // 4. Validate AI JSON fields & fallback defaults
      const { summaryData, recommendationData } = this.validateAndNormalizeJson(finalAnalysisJson);

      // 5. Store / Save Summary result
      let summaryDoc = await Summary.findOne({ contentId: contentItemId });
      if (summaryDoc) {
        Object.assign(summaryDoc, summaryData);
      } else {
        summaryDoc = new Summary({
          contentId: contentItemId,
          ...summaryData
        });
      }
      await summaryDoc.save();

      // 6. Store / Save Recommendation result
      let recDoc = await Recommendation.findOne({ contentId: contentItemId });
      if (recDoc) {
        Object.assign(recDoc, recommendationData);
      } else {
        recDoc = new Recommendation({
          contentId: contentItemId,
          ...recommendationData
        });
      }
      await recDoc.save();

      // Mark content item completed
      contentItem.processedStatus = "completed";
      await contentItem.save();

      console.log(`✅ AI Processing & Recommendation generation complete for content: ${contentItem.title}`);

      return summaryDoc;
    } catch (error) {
      console.error(`❌ AI Processing failed for content item ${contentItemId}: ${error.message}`);

      // Update processing status to failed
      contentItem.processedStatus = "failed";
      await contentItem.save();

      throw error;
    }
  }

  /**
   * Validates structure fields for both summary and recommendation, and provides default normalization fallbacks.
   * @param {object} rawJson - Parsed JSON object from Gemini API
   * @returns {object} Validated structured object with summaryData and recommendationData
   */
  validateAndNormalizeJson(rawJson) {
    const summaryData = {};
    const recommendationData = {};

    // Validate Summary fields
    summaryData.summary = typeof rawJson?.summary === "string" ? rawJson.summary : "";

    summaryData.keyPoints = Array.isArray(rawJson?.keyPoints)
      ? rawJson.keyPoints.filter((k) => typeof k === "string")
      : [];

    summaryData.keywords = Array.isArray(rawJson?.keywords)
      ? rawJson.keywords.filter((k) => typeof k === "string")
      : [];

    summaryData.topics = Array.isArray(rawJson?.topics)
      ? rawJson.topics.filter((t) => typeof t === "string")
      : [];

    summaryData.audience = typeof rawJson?.audience === "string" ? rawJson.audience : "general";

    const diff =
      typeof rawJson?.difficulty === "string" ? rawJson.difficulty.toLowerCase() : "beginner";
    summaryData.difficulty = ["beginner", "intermediate", "advanced"].includes(diff)
      ? diff
      : "beginner";

    const score = Number(rawJson?.confidenceScore);
    summaryData.confidenceScore = !isNaN(score) && score >= 0 && score <= 1 ? score : 0.8;

    // Validate Recommendation fields
    recommendationData.suggestedTitle =
      typeof rawJson?.suggestedTitle === "string"
        ? rawJson.suggestedTitle.trim()
        : "TrendPilot Content Suggestion";

    recommendationData.platform = Array.isArray(rawJson?.platform)
      ? rawJson.platform.filter((p) => typeof p === "string")
      : ["LinkedIn"];

    const format = typeof rawJson?.contentFormat === "string" ? rawJson.contentFormat : "Post";
    recommendationData.contentFormat = [
      "Post",
      "Carousel",
      "Reel",
      "Short",
      "Article",
      "Thread",
      "Newsletter"
    ].includes(format)
      ? format
      : "Post";

    recommendationData.hook = typeof rawJson?.hook === "string" ? rawJson.hook.trim() : "Check this out!";

    recommendationData.outline = Array.isArray(rawJson?.outline)
      ? rawJson.outline.filter((o) => typeof o === "string")
      : [];

    recommendationData.caption = typeof rawJson?.caption === "string" ? rawJson.caption.trim() : "";
    recommendationData.cta = typeof rawJson?.cta === "string" ? rawJson.cta.trim() : "";

    recommendationData.hashtags = Array.isArray(rawJson?.hashtags)
      ? rawJson.hashtags.filter((h) => typeof h === "string")
      : [];

    const oppScore = parseInt(rawJson?.opportunityScore);
    recommendationData.opportunityScore =
      !isNaN(oppScore) && oppScore >= 0 && oppScore <= 100 ? oppScore : 70;

    const trScore = parseInt(rawJson?.trendScore);
    recommendationData.trendScore = !isNaN(trScore) && trScore >= 0 && trScore <= 100 ? trScore : 70;

    recommendationData.confidenceScore = summaryData.confidenceScore;

    return { summaryData, recommendationData };
  }
}

export default new AIService();
