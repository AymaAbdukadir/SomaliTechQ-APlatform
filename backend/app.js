const express = require("express");
const cors = require("cors");
const path = require("path");
const userRoute = require("./routes/userRoutes");
const questionRoute = require("./routes/questionRoutes");
const answerRoute = require("./routes/answersRoutes");

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  credentials: true,
}));
app.use(express.json());

// API routes
app.use("/api/auth/user", userRoute);
app.use("/api/question", questionRoute);
app.use("/api/answer", answerRoute);

// Serve React frontend in production
const frontendDist = path.join(__dirname, "../frontend/dist");
app.use(express.static(frontendDist));

// For any route not matched by the API, serve the React app (client-side routing)
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendDist, "index.html"));
});

module.exports = app;
