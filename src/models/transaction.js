const { Schema, model } = require("mongoose");

const schema = new Schema(
  {
    currentBalance: {
      type: Number,
      required: [true, "Set current balance"],
    },
    date: {
      type: Date,
      required: [true, "Set date"],
    },
    sum: {
      type: Number,
      required: [true, "Set operation sum"],
    },
    type: {
      type: Boolean,
      required: [true, "Set operation type"],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

module.exports = model("transaction", schema);
