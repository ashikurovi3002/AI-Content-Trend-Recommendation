import mongoose from "mongoose";

const summarySchema = new mongoose.Schema(
  {
    contentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ContentItem",
      required: [true, "Content item association is required"],
      unique: true
    },
    summary: {
      type: String,
      required: [true, "Summary content is required"],
      trim: true
    },
    keyPoints: {
      type: [String],
      default: []
    },
    keywords: {
      type: [String],
      default: []
    },
    topics: {
      type: [String],
      default: []
    },
    audience: {
      type: String,
      default: ""
    },
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner"
    },
    confidenceScore: {
      type: Number,
      default: 1.0
    }
  },
  {
    timestamps: true
  }
);

// Indexes
summarySchema.index({ contentId: 1 }, { unique: true });
summarySchema.index({ topics: 1 });
summarySchema.index({ keywords: 1 });

const Summary = mongoose.model("Summary", summarySchema);

export default Summary;
