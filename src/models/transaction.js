const { Schema, model } = require("mongoose");
const { CATEGORIES_INCOME, CATEGORIES_EXPENSE } = require("../constants/constants");

const transactionSchema = new Schema({
  type: {
    type: String,
    enum: ["income", "expense"],
    required: [true, "Transaction type is required"],
  },
  category: {
    type: String,
    enum: [...CATEGORIES_INCOME, ...CATEGORIES_EXPENSE],
    required: [true, "Transaction category is required"],
  },
  balanceAfterTransaction: { 
    type: Number, 
  }, 
  sum: {
    type: Number,
    required: [true, "Sum of transaction is required"],
  },
  // date: {
  //   type: Date,
  //   required: [true, "Date is required"],
  // },
  date: {
    year: { type: Number, required: true },
    month: { type: Number, required: true },
    day: { type: Number, required: true},
  },
  comment: {
    type: String,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
}, { versionKey: false, timestamps: true });

module.exports = model("transaction", transactionSchema);
