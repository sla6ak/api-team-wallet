const { Schema, model } = require("mongoose");

const schema = new Schema({
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  verify: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    required: [true, "Verify token is required"],
  },
  name: { type: String, required: [true, "Name is required"] },
});

module.exports = model("user", schema); // именует модель которая будет созданна при запросе к базе
