const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const questionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    body: {
      type: String,
      required: true, // Supports Markdown text content
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Links back to the user who asked it
    },
    tags: [
      {
        type: String,
        trim: true, // Example: ['React', 'Node.js']
      },
    ],
    votes: {
      type: Number,
      default: 0, // Net score: (Upvotes minus Downvotes)
    },
    voters: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        value: { type: Number, enum: [1, -1] }, // Prevents double voting
      },
    ],
    views: {
      type: Number,
      default: 0, // Tracks unique thread clicks
    },
    isSolved: {
      type: Boolean,
      default: false, // Toggles to true when marked "La Xaliyay"
    },
    acceptedAnswer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Answer",
      default: null, // Links to the single correct solution chosen by the author
    },
  },
  { timestamps: true },
); // Automatically handles createdAt and updatedAt

questionSchema.virtual("answers", {
  ref: "Answer", // Magaca Moodalka Jawaabaha (ku xir siday kuugu qoran tahay ref-ta)
  localField: "_id", // ID-ga su'aashan rasmiga ah
  foreignField: "question", // Field-ka ku dhex jira Answer model ee su'aasha tilmaamaya
});

// 2. Hubi in virtuals-ka loo ogolaaday inay JSON-ka ka mid noqdaan marka API-ga la waco
questionSchema.set("toObject", { virtuals: true });
questionSchema.set("toJSON", { virtuals: true });

questionSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Question", questionSchema);
