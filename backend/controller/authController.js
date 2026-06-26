const User = require("../model/userModel");
const generateToken = require("../utils/generatetoken");
exports.singUp = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const newUser = await User.create({ name, email, password });
    res.status(201).json({
      message: " user created successfully ",
      data: {
        newUser,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
    console.log(err);
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({
      message: "please fill all fields",
    });
  try {
    const user = await User.findOne({ email }).select("+password");
    console.log(user);
    if (!user) {
      return res.status(404).json({
        message: "no user found with that email",
      });
    }
    const ismatch = await user.correctPassword(password);
    if (!ismatch) {
      return res.status(404).json({
        message: "email or passowr is incorrect",
      });
    }
    const token = await generateToken(user._id);

    res.status(200).json({
      message: " loged successfully ",
      token,
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
    console.log(err);
  }
};

exports.getUserList = async (req, res) => {
  try {
    const Question = require("../model/questionModel");
    const Answer = require("../model/answersModel");

    const users = await User.find({}, "name email createdAt");

    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const questionCount = await Question.countDocuments({ author: user._id });
        const answerCount = await Answer.countDocuments({ author: user._id });
        
        // Reputation score: 10 pts per question, 20 pts per answer
        const reputation = questionCount * 10 + answerCount * 20;

        return {
          _id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
          questionCount,
          answerCount,
          reputation,
        };
      })
    );

    // Sort by highest reputation first
    usersWithStats.sort((a, b) => b.reputation - a.reputation);

    return res.status(200).json({
      status: "success",
      data: {
        users: usersWithStats,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: error.message || error,
    });
  }
};
