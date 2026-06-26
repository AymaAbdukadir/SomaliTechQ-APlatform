const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
  // Signs the token using your JWT_SECRET from the .env file
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "30d", // defaults to 30 days
  });
};

module.exports = generateToken;
