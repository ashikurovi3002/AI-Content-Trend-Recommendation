import { GoogleGenerativeAI } from '@google/generative-ai';
import Summary, { ISummary } from '../models/Summary';
import mongoose from 'mongoose';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const generateSummary = async (contentId: string, rawText: string) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
  const prompt = `Analyze the following content and provide a JSON response with the following keys:
  - summary: A concise 2-3 sentence summary.
  - keywords: An array of 3-5 important keywords.
  - topics: An array of 1-3 broad topics.
  - audience: Target audience (e.g., developers, marketers).
  - sentiment: Overall sentiment (positive, neutral, negative).
  - difficulty: Beginner, Intermediate, or Advanced.

  Content:
  ${rawText.substring(0, 5000)} // Truncate to save tokens
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  let text = response.text();
  
  // Clean markdown block if present
  text = text.replace(/```json/g, '').replace(/```/g, '');
  const parsedData = JSON.parse(text);

  const summary = new Summary({
    contentId: new mongoose.Types.ObjectId(contentId),
    summary: parsedData.summary,
    keywords: parsedData.keywords,
    topics: parsedData.topics,
    audience: parsedData.audience,
    sentiment: parsedData.sentiment,
    difficulty: parsedData.difficulty,
  });

  return await summary.save();
};

export const generateRecommendations = async (contentId: string, summary: ISummary) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
  const prompt = `Based on the following content summary, generate 3 content ideas for social media (Facebook, LinkedIn, YouTube).
  Return a JSON array of objects with the following keys:
  - suggestedTitle: A catchy title.
  - hook: An engaging opening line.
  - outline: An array of 3 bullet points.
  - platform: Facebook, LinkedIn, or YouTube.
  - contentType: Post, Reel, Shorts, or Carousel.
  - opportunityScore: Number between 1-100 indicating trend potential.
  - confidenceScore: Number between 1-100 indicating AI confidence.

  Summary Data:
  ${JSON.stringify(summary)}
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  let text = response.text();
  text = text.replace(/```json/g, '').replace(/```/g, '');
  const parsedData = JSON.parse(text);

  return parsedData; // returns array of recommendations
};
