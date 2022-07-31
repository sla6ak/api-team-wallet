const TransactionModel = require("../models/transaction");
const UserModel = require("../models/user");
const { defaultResponseData } = require("../helpers");

class Transaction {
  async getAllTransaction(req, res, next) {
    try {
      const user = req.user;
      const owner = user._id;

      const transactions = await TransactionModel.find({ owner }, "-createdAt -updatedAt");

      if (transactions.length === 0) {
        const data = { ...defaultResponseData(), user };
        res.json(data);
      }

      return res
        .status(200)
        .json({
          response: {
            user,
            transactions
          }
        });
    } catch (error) {
      next(error);
    }
  }

  async addNewTransaction(req, res, next) {
    try {
      const user = req.user;
      const { type, sum } = req.body;

      const previousBalance = user.currentBalance;

      const balanceAfterTransaction =
        type === 'income'
          ? previousBalance + sum
          : previousBalance - sum;

      const updatedUser = await UserModel.findByIdAndUpdate(user._id, { currentBalance: balanceAfterTransaction }, {new: true});

      // TODO: формат даты обсудить
      // TODO: проверяем есть ли другие транзакции после даты текущей транзакции

      const newTransaction = await TransactionModel.create({
        ...req.body,
        balanceAfterTransaction,
        owner: user._id,
      });

      const data = {
        ...defaultResponseData(),
        user: updatedUser,
        status: "201",
        message: "Transaction was created successfully",
        transaction: newTransaction,
      };

      return res.json(data);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new Transaction();
