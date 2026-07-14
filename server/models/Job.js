import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    sourceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Source",
      required: [true, "Source ID association is required"]
    },
    startedAt: {
      type: Date,
      default: Date.now,
      required: true
    },
    finishedAt: {
      type: Date,
      default: null
    },
    status: {
      type: String,
      enum: ["running", "completed", "failed"],
      default: "running",
      required: true
    },
    error: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

// Indexes (per docs/03-database-design.md)
jobSchema.index({ sourceId: 1 });
jobSchema.index({ status: 1 });

const Job = mongoose.model("Job", jobSchema);

export default Job;
