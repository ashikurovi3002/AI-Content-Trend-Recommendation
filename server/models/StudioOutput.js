import mongoose from "mongoose";

const studioOutputSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User association is required"]
    },
    contentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ContentItem",
      default: null
    },
    format: {
      type: String,
      required: [true, "Target format is required"]
    },
    instructions: {
      type: String,
      default: ""
    },
    content: {
      type: String,
      required: [true, "Generated content is required"]
    }
  },
  {
    timestamps: true
  }
);

// Indexes
studioOutputSchema.index({ userId: 1 });
studioOutputSchema.index({ userId: 1, createdAt: -1 });

const StudioOutput = mongoose.model("StudioOutput", studioOutputSchema);

export default StudioOutput;
