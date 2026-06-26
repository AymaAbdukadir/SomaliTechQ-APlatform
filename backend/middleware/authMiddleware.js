const jwt = require("jsonwebtoken");
const User = require("../model/userModel"); // Adjust the path to your User model

exports.protect = async (req, res, next) => {
  try {
    let token;

    // 1. Check if token exists in the Authorization header and starts with "Bearer"
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      // Extract token from "Bearer <token_string>"
      token = req.headers.authorization.split(" ")[1];
    }

    // 2. If no token, deny access
    if (!token) {
      return res.status(401).json({
        message: "You are not logged in. Please log in to get access.",
      });
    }

    // 3. Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Check if the user associated with the token still exists in the database
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        message: "The user belonging to this token no longer exists.",
      });
    }

    // 5. Grant access: Attach user data to the request object for future routes to use
    req.user = currentUser;
    next(); // Pass control to the next middleware or controller function
  } catch (err) {
    // Catch token expiration or invalid signature errors
    return res.status(401).json({
      message: "Invalid or expired token. Access denied.",
    });
  }
};
