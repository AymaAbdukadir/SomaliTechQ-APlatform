const express = require("express");
const router = express.Router();
const {
  createQuestion,
  getAllQuestions,
  getSingleQuestion,
  updateQuestion,
  deleteQuestion,
  upvoteQuestion,
  downvoteQuestion,
  acceptAnswer,
  getTagsList,
} = require("../controller/questionController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").post(protect, createQuestion).get(getAllQuestions);

router.get("/tags/list", getTagsList);

router.put("/:id/accept/:answerId", protect, acceptAnswer);

router.route("/:id").get(getSingleQuestion);
router.put("/:id", protect, updateQuestion);
router.delete("/:id", protect, deleteQuestion);
router.put("/:id/upvote", protect, upvoteQuestion);
router.put("/:id/downvote", protect, downvoteQuestion);

module.exports = router;
