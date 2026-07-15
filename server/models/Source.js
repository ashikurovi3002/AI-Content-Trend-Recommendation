import mongoose from "mongoose";

const sourceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User association is required"]
    },
    name: {
      type: String,
      required: [true, "Source name is required"],
      trim: true
    },
    type: {
      type: String,
      enum: ["website", "youtube", "facebook"],
      required: [true, "Source type is required (website, youtube or facebook)"]
    },
    url: {
      type: String,
      required: [true, "Source URL is required"],
      trim: true
    },
    category: {
      type: String,
      required: [true, "Source category is required"],
      trim: true
    },
    status: {
      type: String,
      enum: ["active", "paused", "error"],
      default: "active"
    },
    lastCheckedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Indexes (per docs/03-database-design.md)
sourceSchema.index({ userId: 1 });
sourceSchema.index({ status: 1 });
sourceSchema.index({ type: 1 });

const Source = mongoose.model("Source", sourceSchema);

export default Source;
