import mongoose from "mongoose";

const recommendationSchema = new mongoose.Schema(
  {
    contentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ContentItem",
      required: [true, "Content item association is required"],
      unique: true
    },
    suggestedTitle: {
      type: String,
      required: [true, "Suggested title is required"],
      trim: true
    },
    platform: {
      type: [String],
      default: ["LinkedIn"]
    },
    contentFormat: {
      type: String,
      enum: ["Post", "Carousel", "Reel", "Short", "Article", "Thread", "Newsletter"],
      default: "Post"
    },
    hook: {
      type: String,
      required: [true, "Viral hook is required"],
      trim: true
    },
    outline: {
      type: [String],
      default: []
    },
    caption: {
      type: String,
      default: ""
    },
    cta: {
      type: String,
      default: ""
    },
    hashtags: {
      type: [String],
      default: []
    },
    opportunityScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 70
    },
    trendScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 70
    },
    confidenceScore: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.8
    },
    competitorAnalysis: {
      viralFactors: { type: String, default: "" },
      missedOpportunities: { type: String, default: "" },
      beatStrategy: { type: String, default: "" }
    },
    platformStrategy: [
      {
        platform: { type: String, required: true },
        hook: { type: String, default: "" },
        format: { type: String, default: "" },
        estimatedReach: { type: String, default: "Medium" },
        bestTime: { type: String, default: "" },
        captionDraft: { type: String, default: "" }
      }
    ]
  },
  {
    timestamps: true
  }
);

// Indexes
recommendationSchema.index({ platform: 1 });
recommendationSchema.index({ opportunityScore: -1 });

const Recommendation = mongoose.model("Recommendation", recommendationSchema);

export default Recommendation;
