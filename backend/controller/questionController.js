const Question = require("../model/questionModel");
const Answer = require("../model/answersModel");
const { applyVote } = require("../utils/voteHelper");

const AUTHOR_FIELDS = "name email -password";

const populateOptions = [
  { path: "author", select: AUTHOR_FIELDS },
  {
    path: "answers",
    options: { sort: { votes: -1, createdAt: 1 } },
    populate: { path: "author", select: AUTHOR_FIELDS },
  },
  {
    path: "acceptedAnswer",
    populate: { path: "author", select: AUTHOR_FIELDS },
  },
];

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

exports.createQuestion = async (req, res) => {
  try {
    const { title, body, tags } = req.body;
    const question = await Question.create({
      title,
      body,
      tags,
      author: req.user._id,
    });
    res.status(201).json({
      status: "success",
      message: "Question created successfully",
      data: {
        question,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message || error,
    });
  }
};

exports.getAllQuestions = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const { search, tag } = req.query;

    const filter = {};

    if (search) {
      const escaped = escapeRegex(search);
      filter.$or = [
        { title: { $regex: escaped, $options: "i" } },
        { body: { $regex: escaped, $options: "i" } },
      ];
    }

    if (tag) {
      const escapedTag = escapeRegex(tag);
      filter.tags = { $regex: new RegExp(`^${escapedTag}$`, "i") };
    }

    const result = await Question.paginate(filter, {
      page,
      limit,
      sort: { createdAt: -1 },
      populate: populateOptions,
    });

    return res.status(200).json({
      status: "success",
      results: result.docs.length,
      pagination: {
        totalDocs: result.totalDocs,
        totalPages: result.totalPages,
        page: result.page,
        limit: result.limit,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage,
      },
      data: {
        questions: result.docs,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: error.message || error,
    });
  }
};

exports.getSingleQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { returnDocument: "after" },
    ).populate(populateOptions);

    if (!question) {
      return res.status(404).json({
        status: "fail",
        message: "Question not found.",
      });
    }

    return res.status(200).json({
      status: "success",
      data: {
        question,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: error.message || error,
    });
  }
};

exports.updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, body, tags } = req.body;

    const question = await Question.findById(id);

    if (!question) {
      return res.status(404).json({
        status: "fail",
        message: "Question to update not found.",
      });
    }

    if (question.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: "fail",
        message:
          "You are not authorized to edit a question you did not write.",
      });
    }

    if (title) question.title = title;
    if (body) question.body = body;
    if (tags) question.tags = tags;

    await question.save();

    return res.status(200).json({
      status: "success",
      message: "Your question has been updated successfully.",
      data: { question },
    });
  } catch (error) {
    return res.status(500).json({ status: "fail", message: error.message });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await Question.findById(id);

    if (!question) {
      return res.status(404).json({
        status: "fail",
        message: "Question to delete not found.",
      });
    }

    if (question.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: "fail",
        message: "You are not authorized to delete a question you did not write.",
      });
    }

    await Answer.deleteMany({ question: id });
    await Question.findByIdAndDelete(id);

    return res.status(200).json({
      status: "success",
      message: "Your question and its answers have been deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({ status: "fail", message: error.message });
  }
};

const handleQuestionVote = (voteValue) => async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        status: "fail",
        message: "Question not found.",
      });
    }

    const result = applyVote({
      doc: question,
      userId: req.user._id,
      authorId: question.author,
      voteValue,
    });

    if (!result.ok) {
      return res
        .status(result.status)
        .json({ status: "fail", message: result.message });
    }

    await question.save();

    return res.status(200).json({
      status: "success",
      message: result.message,
      data: {
        votes: question.votes,
      },
    });
  } catch (error) {
    return res.status(500).json({ status: "fail", message: error.message });
  }
};

exports.upvoteQuestion = handleQuestionVote(1);
exports.downvoteQuestion = handleQuestionVote(-1);

exports.acceptAnswer = async (req, res) => {
  try {
    const { id: questionId, answerId } = req.params;

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({
        status: "fail",
        message: "Question not found.",
      });
    }

    if (question.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: "fail",
        message: "Only the question author can accept an answer.",
      });
    }

    const answer = await Answer.findOne({ _id: answerId, question: questionId });
    if (!answer) {
      return res.status(404).json({
        status: "fail",
        message: "This answer is not linked to this question.",
      });
    }

    if (
      question.acceptedAnswer &&
      question.acceptedAnswer.toString() !== answerId
    ) {
      await Answer.findByIdAndUpdate(question.acceptedAnswer, {
        isAccepted: false,
      });
    }

    answer.isAccepted = true;
    await answer.save();

    question.acceptedAnswer = answer._id;
    question.isSolved = true;
    await question.save();

    const updatedQuestion = await Question.findById(questionId).populate(
      populateOptions,
    );

    return res.status(200).json({
      status: "success",
      message: "Answer accepted successfully.",
      data: { question: updatedQuestion },
    });
  } catch (error) {
    return res.status(500).json({ status: "fail", message: error.message });
  }
};

exports.getTagsList = async (req, res) => {
  try {
    const tagCounts = await Question.aggregate([
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } }
    ]);
    
    const Tag = require("../model/TagModel");
    const tagInfos = await Tag.find({});
    
    const infoMap = {};
    tagInfos.forEach(t => {
      infoMap[t.name.toLowerCase()] = t.description;
    });
    
    const defaultDescriptions = {
      javascript: "A programming language used to build dynamic, interactive websites.",
      react: "A JavaScript library for building modern user interfaces (UI).",
      nodejs: "A JavaScript runtime environment that runs on the server side.",
      mongodb: "A NoSQL database that stores data in a JSON-like format (documents).",
      express: "A minimal framework for building web APIs with Node.js.",
      python: "A programming language popular for machine learning and its simplicity.",
      css: "A language used for styling and designing web pages.",
      html: "A foundational language used to structure web pages.",
      tailwind: "A utility-class-based CSS framework that simplifies UI design.",
      nextjs: "A React framework with server-side rendering and great SEO capabilities.",
      git: "A version control system for managing code projects."
    };
    
    const results = tagCounts.map(tc => {
      const name = tc._id;
      const lower = name.toLowerCase();
      const description = infoMap[lower] || defaultDescriptions[lower] || `Questions related to ${name} technology.`;
      return {
        name,
        count: tc.count,
        description
      };
    }).sort((a, b) => b.count - a.count);
    
    return res.status(200).json({
      status: "success",
      data: {
        tags: results
      }
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: error.message || error
    });
  }
};
