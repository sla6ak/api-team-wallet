const TransactionModel = require("../models/transaction");
const UserModel = require("../models/user");
const { defaultResponseData, getStatisticByCategories } = require("../helpers");

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

      const updatedUser =
        await UserModel.findByIdAndUpdate(
          user._id,
          { currentBalance: balanceAfterTransaction },
          { new: true });

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

  async getStatistic(req, res, next) {
    try {
      const user = req.user;
      const owner = user._id;
      const transactions = await TransactionModel.find({ owner }, "-createdAt -updatedAt");

      let expenseStatistic = []; // что возвращать если транзакций нет? пустой массив или null
      
      if (transactions.length !== 0) {
        expenseStatistic = getStatisticByCategories(transactions);
      }

      // общую сумму доход
      // общую сумму расход

      return res.status(200).json({expenseStatistic})

    } catch (error) {
      next(error);
    }
  }
}

module.exports = new Transaction();

  
// eslint-disable-next-line no-unused-expressions
[
  {
    type: "income",
    totalIncomeSum: 3405
  },
  {
    type: "expense",
    totalExpenseSum: 2833,
    statistic: [
      {
        category: 1,
        totalSum: 330
      },
      {
        category: 2,
        totalSum: 330
      }
    ]
  }
]