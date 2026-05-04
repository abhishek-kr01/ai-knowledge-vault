const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 180
    },
    content: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: ["processing", "ready", "failed"],
      default: "processing"
    },
    summary: {
      type: String,
      default: ""
    },
    keyPoints: {
      type: [String],
      default: []
    },
    tags: {
      type: [String],
      default: []
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Note", noteSchema);
