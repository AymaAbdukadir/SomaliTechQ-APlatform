const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: [true, "email is already exists"],
  },
  password: {
    type: String,
    required: true,
    select: true,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);

    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
});
userSchema.methods.correctPassword = async function (candiatePassowrd) {
  return await bcrypt.compare(candiatePassowrd, this.password);
};
const User = mongoose.model("User", userSchema);
module.exports = User;
