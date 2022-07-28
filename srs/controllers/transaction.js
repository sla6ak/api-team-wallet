const TransactionModel = require("../models/transaction");

class Transaction {
  async getAllTransaction(req, res, next) {
    try {
      await TransactionModel.find({});
      return res.status(200).json({ message: "status 200", response: allContacts });
    } catch (error) {
      return res
        .status(404)
        .json({ message: `Transaction not found`, response: null, error: error });
    }
  }

  async addNewTransaction(req, res, next) {
    try {
      const transaction = new TransactionModel({
        email: email,
        password: hashPassword,
        avatarURL: avatarRandom,
        verificationToken: verificationToken,
      });
      return res.status(200).json({ message: "status 201", response: newContact });
    } catch (error) {
      return res.status(404).json({
        message: "Transaction not created, i am sorry try again",
        response: null,
        error: error,
      });
    }
  }
}

module.exports = new Transaction();
