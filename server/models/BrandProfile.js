import mongoose from "mongoose";

const brandProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User association is required"],
      unique: true
    },
    brandName: {
      type: String,
      required: [true, "Brand name is required"],
      trim: true
    },
    industry: {
      type: String,
      required: [true, "Industry is required"],
      trim: true
    },
    targetAudience: {
      type: String,
      required: [true, "Target audience is required"],
      trim: true
    },
    tone: {
      type: String,
      required: [true, "Brand voice/writing tone is required"],
      trim: true
    },
    primaryPlatforms: {
      type: [String],
      default: ["Facebook", "LinkedIn", "Twitter/X", "YouTube"]
    }
  },
  {
    timestamps: true
  }
);

const BrandProfile = mongoose.model("BrandProfile", brandProfileSchema);

export default BrandProfile;
