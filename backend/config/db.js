const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const Mongo_URI = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(Mongo_URI);
    console.log("DB connected sucessfully");
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectDB;
