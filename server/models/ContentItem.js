import mongoose from "mongoose";

const contentItemSchema = new mongoose.Schema(
  {
    sourceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Source",
      required: [true, "Source association is required"]
    },
    externalId: {
      type: String,
      required: [true, "External unique identifier is required"],
      unique: true
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true
    },
    description: {
      type: String,
      default: ""
    },
    url: {
      type: String,
      required: [true, "URL is required"],
      trim: true
    },
    thumbnail: {
      type: String,
      default: ""
    },
    author: {
      type: String,
      default: ""
    },
    publishedAt: {
      type: Date,
      default: Date.now
    },
    rawText: {
      type: String,
      default: ""
    },
    processedStatus: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending"
    }
  },
  {
    timestamps: true
  }
);

// Indexes (per docs/03-database-design.md)
contentItemSchema.index({ sourceId: 1 });
contentItemSchema.index({ externalId: 1 }, { unique: true });
contentItemSchema.index({ publishedAt: -1 });

const ContentItem = mongoose.model("ContentItem", contentItemSchema);

export default ContentItem;
