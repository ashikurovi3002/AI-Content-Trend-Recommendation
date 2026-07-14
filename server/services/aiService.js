import fs from "fs/promises";
import path from "path";
import axios from "axios";
import ContentItem from "../models/ContentItem.js";
import Summary from "../models/Summary.js";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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
  chunkText(text, maxChars = 15000, overlap = 1500) {
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
   * Makes a REST call to Google Gemini 1.5 Flash API with exponential backoff retries.
   * @param {string} promptText - Prompt content
   * @param {number} retries - Maximum retries
   * @param {number} baseDelay - Delay multiplier in milliseconds
   * @returns {Promise<object>} Parsed JSON response
   */
  async callGemini(promptText, retries = 3, baseDelay = 2000) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined in the environment variables");
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const payload = {
      contents: [
        {
          parts: [{ text: promptText }]
        }
      ],
      generationConfig: {
        responseMimeType: "application/json"
      }
    };

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await axios.post(url, payload, { timeout: 15000 });
        const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
          throw new Error("Received empty response candidate from Gemini model");
        }

        // Clean json blocks if they were wrapped in markdown tick tags despite config
        const cleanedText = text
          .replace(/^```json/, "")
          .replace(/```$/, "")
          .trim();

        const parsedJson = JSON.parse(cleanedText);
        return parsedJson;
      } catch (error) {
        console.warn(`⚠️ Gemini API request attempt ${attempt} failed: ${error.message}`);

        const isRateLimit = error.response?.status === 429;
        if (attempt === retries) {
          throw error;
        }

        // Exponential backoff delay
        const backoffDelay = isRateLimit ? baseDelay * 3 * attempt : baseDelay * attempt;
        console.log(`⏰ Retrying Gemini call in ${backoffDelay}ms...`);
        await sleep(backoffDelay);
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

    const contentItem = await ContentItem.findById(contentItemId);
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
      const summarizePromptTpl = await fs.readFile(path.join(promptDir, "summarize.txt"), "utf8");

      let finalAnalysisJson = null;

      // 3. Chunking check
      const chunks = this.chunkText(cleaned, 15000, 1500);

      if (chunks.length <= 1) {
        console.log("👉 Single chunk processing...");
        // Replace templates
        const prompt = summarizePromptTpl
          .replace("{{TITLE}}", contentItem.title)
          .replace("{{DESCRIPTION}}", contentItem.description || "")
          .replace("{{CONTENT}}", cleaned);

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

        const finalPrompt = summarizePromptTpl
          .replace("{{TITLE}}", contentItem.title)
          .replace("{{DESCRIPTION}}", contentItem.description || "")
          .replace("{{CONTENT}}", consolidatedText);

        finalAnalysisJson = await this.callGemini(finalPrompt);
      }

      // 4. Validate AI JSON fields & fallback defaults
      const validated = this.validateAndNormalizeJson(finalAnalysisJson);

      // 5. Store / Save result to summaries collection (unique contentId check)
      let summaryDoc = await Summary.findOne({ contentId: contentItemId });
      if (summaryDoc) {
        summaryDoc.summary = validated.summary;
        summaryDoc.keyPoints = validated.keyPoints;
        summaryDoc.keywords = validated.keywords;
        summaryDoc.topics = validated.topics;
        summaryDoc.audience = validated.audience;
        summaryDoc.difficulty = validated.difficulty;
        summaryDoc.confidenceScore = validated.confidenceScore;
      } else {
        summaryDoc = new Summary({
          contentId: contentItemId,
          summary: validated.summary,
          keyPoints: validated.keyPoints,
          keywords: validated.keywords,
          topics: validated.topics,
          audience: validated.audience,
          difficulty: validated.difficulty,
          confidenceScore: validated.confidenceScore
        });
      }
      await summaryDoc.save();

      // Mark content item completed
      contentItem.processedStatus = "completed";
      await contentItem.save();

      console.log(`✅ AI Processing complete for content: ${contentItem.title}`);

      // Dynamically import and trigger recommendation generation in the background to avoid ESM circular dependency
      import("./recommendationService.js")
        .then(({ default: recService }) => {
          recService.generateRecommendation(contentItemId).catch((recErr) => {
            console.error(`❌ Auto recommendation failed for ${contentItemId}: ${recErr.message}`);
          });
        })
        .catch((importErr) => {
          console.error(`❌ Failed to import recommendationService: ${importErr.message}`);
        });

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
   * Validates structure fields and provides default normalization fallbacks.
   * @param {object} rawJson - Parsed JSON object from Gemini API
   * @returns {object} Validated structured object
   */
  validateAndNormalizeJson(rawJson) {
    const normalized = {};

    normalized.summary = typeof rawJson?.summary === "string" ? rawJson.summary : "";

    normalized.keyPoints = Array.isArray(rawJson?.keyPoints)
      ? rawJson.keyPoints.filter((k) => typeof k === "string")
      : [];

    normalized.keywords = Array.isArray(rawJson?.keywords)
      ? rawJson.keywords.filter((k) => typeof k === "string")
      : [];

    normalized.topics = Array.isArray(rawJson?.topics)
      ? rawJson.topics.filter((t) => typeof t === "string")
      : [];

    normalized.audience = typeof rawJson?.audience === "string" ? rawJson.audience : "general";

    // Validate difficulty enum values
    const diff =
      typeof rawJson?.difficulty === "string" ? rawJson.difficulty.toLowerCase() : "beginner";
    normalized.difficulty = ["beginner", "intermediate", "advanced"].includes(diff)
      ? diff
      : "beginner";

    // Validate confidence score bounds
    const score = Number(rawJson?.confidenceScore);
    normalized.confidenceScore = !isNaN(score) && score >= 0 && score <= 1 ? score : 0.8;

    return normalized;
  }
}

export default new AIService();
