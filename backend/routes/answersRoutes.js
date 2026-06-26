const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  createAnswer,
  upvoteAnswer,
  downvoteAnswer,
} = require("../controller/answerController");

const router = express.Router();

router.post("/:id/create-answer", protect, createAnswer);
router.put("/:answerId/upvote", protect, upvoteAnswer);
router.put("/:answerId/downvote", protect, downvoteAnswer);

module.exports = router;
