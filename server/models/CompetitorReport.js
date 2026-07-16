import mongoose from "mongoose";

const competitorReportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User association is required"]
    },
    competitorIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Competitor"
      }
    ],
    type: {
      type: String,
      enum: ["single", "comparison", "weekly_strategy"],
      required: [true, "Report type is required"]
    },
    reportData: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, "Report content data is required"]
    }
  },
  {
    timestamps: true
  }
);

competitorReportSchema.index({ userId: 1 });
competitorReportSchema.index({ createdAt: -1 });
competitorReportSchema.index({ userId: 1, createdAt: -1 });

const CompetitorReport = mongoose.model("CompetitorReport", competitorReportSchema);

export default CompetitorReport;
