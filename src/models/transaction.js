const { Schema, model } = require("mongoose");

const transactionSchema = new Schema({
  type: {
    type: String,
    enum: ["income", "expense"],
    required: [true, "Transaction type is required"],
  },
  category: {
    type: String,
    // TODO: Решить какие будут категории
    enum: ["Main", "Food", "Auto", "Children", "House", "Education"],
    required: [true, "Transaction category is required"],
  },
  balanceAfterTransaction: { 
    type: Number, 
  }, 
  sum: {
    type: Number,
    required: [true, "Sum of transaction is required"],
  },
  date: {
    type: Date,
    required: [true, "Date is required"],
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
