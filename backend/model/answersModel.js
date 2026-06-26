const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema(
  {
    body: {
      type: String,
      required: true, // Supports Markdown text and code blocks
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Links to the user providing the solution
    },
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true, // Links back to the parent question thread
    },
    votes: {
      type: Number,
      default: 0, // Net score for the reply
    },
    voters: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        value: { type: Number, enum: [1, -1] },
      },
    ],
    isAccepted: {
      type: Boolean,
      default: false, // Marked true if selected as the winning answer by the question author
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Answer", answerSchema);
