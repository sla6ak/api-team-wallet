const TransactionModel = require("../models/transaction");
const UserModel = require("../models/user");
const { getStatisticByCategories } = require("../helpers");
const { TRANSACTION_TYPES } = require("../constants/constants");

class Transaction {
  async getAllTransaction(req, res, next) {
    try {
      const user = req.user;
      const owner = user._id;

      const transactions = await TransactionModel.find({ owner }, "-createdAt -updatedAt");

      const data = {
        user, // TODO: нужно ли возвращать юзера, еще и со всеми полями?
        transactions,
      }

      return res.status(200).json(data);
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
        type === TRANSACTION_TYPES.INCOME
          ? previousBalance + sum
          : previousBalance - sum;

      const updatedUser =
        await UserModel.findByIdAndUpdate(
          user._id,
          { currentBalance: balanceAfterTransaction },
          { new: true });

      // TODO: проверить есть ли другие транзакции после даты текущей транзакции и изменить в них поле balanceAfterTransaction

      const newTransaction = await TransactionModel.create({
        ...req.body,
        balanceAfterTransaction,
        owner: user._id,
      });

      const data = {
        user: updatedUser, // TODO: нужно ли возвращать юзера, еще и со всеми полями?
        message: "Transaction was created successfully",
        transaction: newTransaction,
      };

      return res.status(201).json(data);
    } catch (error) {
      next(error);
    }
  }

  async getStatistic(req, res, next) {
    try {
      const user = req.user;
      const owner = user._id;
      const transactions = await TransactionModel.find({ owner }, "-createdAt -updatedAt");

      let totalIncomeSum = 0;
      let totalExpenseSum = 0;
      let expenseStatistic = [];

      if (transactions.length !== 0) {
        transactions.forEach(transaction => {
          if (transaction.type === TRANSACTION_TYPES.INCOME) {
            totalIncomeSum += transaction.sum;
          } else {
            totalExpenseSum += transaction.sum;
          }
        });

        const expenseTransactions = transactions.filter(transaction => {
          return transaction.type === TRANSACTION_TYPES.EXPENSE;
        });
        
        if (expenseTransactions.length !== 0) {
          expenseStatistic = getStatisticByCategories(expenseTransactions);
        };
      }

      const data = [
        {
          type: TRANSACTION_TYPES.INCOME,
          totalIncomeSum
        },
        {
          type: TRANSACTION_TYPES.EXPENSE,
          totalExpenseSum,
          expenseStatistic,
        },
      ];

      return res.status(200).json(data);

    } catch (error) {
      next(error);
    }
  }
}

module.exports = new Transaction();
