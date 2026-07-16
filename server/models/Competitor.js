import mongoose from "mongoose";

const competitorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User association is required"]
    },
    brandName: {
      type: String,
      required: [true, "Brand name is required"],
      trim: true
    },
    pageUrl: {
      type: String,
      required: [true, "Facebook Page URL is required"],
      trim: true
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true
    },
    logo: {
      type: String,
      default: ""
    },
    description: {
      type: String,
      default: ""
    },
    lastCheckedAt: {
      type: Date,
      default: null
    },
    status: {
      type: String,
      enum: ["active", "paused", "error"],
      default: "active"
    }
  },
  {
    timestamps: true
  }
);

competitorSchema.index({ userId: 1 });
competitorSchema.index({ pageUrl: 1 });
competitorSchema.index({ userId: 1, createdAt: -1 });
competitorSchema.index({ userId: 1, status: 1 });

const Competitor = mongoose.model("Competitor", competitorSchema);

export default Competitor;
