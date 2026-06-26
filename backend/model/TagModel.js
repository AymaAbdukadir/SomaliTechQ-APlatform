const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true, // Prevents duplicate tags like 'react' and 'React'
      trim: true,
    },
    description: {
      type: String,
      required: true, // Localized definition of the technology in Somali
    },
    questionCount: {
      type: Number,
      default: 0, // Denormalized counter to show popular tags fast without heavy queries
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Tag", tagSchema);
