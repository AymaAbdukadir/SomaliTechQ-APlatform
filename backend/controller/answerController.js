const Question = require("../model/questionModel");
const Answer = require("../model/answersModel");
const { applyVote } = require("../utils/voteHelper");

const AUTHOR_FIELDS = "name email -password";

const handleAnswerVote = (voteValue) => async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.answerId);

    if (!answer) {
      return res.status(404).json({
        status: "fail",
        message: "Jawaabta lama helin.",
      });
    }

    const result = applyVote({
      doc: answer,
      userId: req.user._id,
      authorId: answer.author,
      voteValue,
    });

    if (!result.ok) {
      return res
        .status(result.status)
        .json({ status: "fail", message: result.message });
    }

    await answer.save();

    const populatedAnswer = await Answer.findById(answer._id).populate(
      "author",
      AUTHOR_FIELDS,
    );

    return res.status(200).json({
      status: "success",
      message: result.message,
      data: { answer: populatedAnswer },
    });
  } catch (error) {
    return res.status(500).json({ status: "fail", message: error.message });
  }
};

exports.upvoteAnswer = handleAnswerVote(1);
exports.downvoteAnswer = handleAnswerVote(-1);

exports.createAnswer = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({
        status: "fail",
        message: "Su'aasha aad u jawaabayso lama helin.",
      });
    }

    const { body } = req.body;
    if (!body) {
      return res.status(400).json({
        status: "fail",
        message: "Fadlan qor qoraalka jawaabta (body).",
      });
    }

    const answer = await Answer.create({
      body,
      author: req.user._id,
      question: id,
    });

    const populatedAnswer = await Answer.findById(answer._id).populate(
      "author",
      AUTHOR_FIELDS,
    );

    return res.status(201).json({
      status: "success",
      message: "Jawaabtaada si guul leh ayaa loo kaydiyey",
      data: {
        answer: populatedAnswer,
      },
    });
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: err.message || err,
    });
  }
};
