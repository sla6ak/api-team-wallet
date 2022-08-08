const TransactionModel = require("../models/transaction");
const UserModel = require("../models/user");
const {
  getStatisticByCategories,
  isLaterTransaction,
  countBalance,
} = require("../helpers");
const { TRANSACTION_TYPES } = require("../constants/constants");

class Transaction {
  async getAllTransaction(req, res, next) {
    try {
      const user = req.user;
      const owner = user._id;

      const transactions = await TransactionModel.find({ owner }, "-createdAt -updatedAt");

      const data = {
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
      const owner = user._id;
      const { type, sum, date: dateString } = req.body;

      const newDate = new Date(dateString);

      const date = {
        year: newDate.getFullYear(),
        month: newDate.getMonth() + 1,
        day: newDate.getDate(),
      };

      const previousBalance = user.currentBalance;

      const currentBalance = countBalance(type, previousBalance, sum);

      let balanceAfterTransaction;

      const laterTransactionsByYear = await TransactionModel.find({ 
        owner, 
        "date.year": { $gte: date.year },
      }); 

      // eslint-disable-next-line array-callback-return
      const laterTransactionsByFullDate = laterTransactionsByYear.filter(transaction => {
        if (isLaterTransaction(transaction, date)) {
          return transaction;
        }
      });

      if (laterTransactionsByFullDate.length === 0) {
        balanceAfterTransaction = currentBalance;
      }

      if (laterTransactionsByFullDate.length > 0) {
        const temp = [];

        laterTransactionsByFullDate.forEach(async transaction => {
          temp.push(transaction.balanceAfterTransaction);

          const updatedBalanceAfterTransaction = countBalance(
            type,
            transaction.balanceAfterTransaction,
            sum);
          console.log('updatedBalanceAfterTransaction', updatedBalanceAfterTransaction);
                      
          const updatedTransaction = await TransactionModel.findByIdAndUpdate(transaction._id, {
            balanceAfterTransaction: updatedBalanceAfterTransaction,
          }, { new: true });
          console.log(updatedTransaction); // check
        });

        const max = Math.max(...temp);
        const earliestTransaction =
          laterTransactionsByFullDate.filter(transaction =>
            transaction.balanceAfterTransaction === max
          );

        balanceAfterTransaction = earliestTransaction[0].balanceAfterTransaction;
      };

      const newTransaction = await TransactionModel.create({
        ...req.body,
        date,
        balanceAfterTransaction,
        owner: user._id,
      });
      console.log(newTransaction); // check

      const updatedUser =
        await UserModel.findByIdAndUpdate(
          user._id,
          { currentBalance },
          { new: true });
      console.log(updatedUser); // check

      const data = {
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

      const { totalIncomeSum, totalExpenseSum, expenseStatistic } =
        getStatisticByCategories(transactions);

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

  async getStatisticByYear(req, res, next) {
    try {
      const user = req.user;
      const owner = user._id;

      const { year } = req.params;

      const transactions = await TransactionModel.find({ 
        owner, 
        "date.year": year, 
      }); 

      const { totalIncomeSum, totalExpenseSum, expenseStatistic } =
        getStatisticByCategories(transactions);

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

  async getStatisticByMonth(req, res, next) {
    try {
      const user = req.user;
      const owner = user._id;

      const { year, month } = req.params;

      const transactions = await TransactionModel.find({ 
        owner, 
        "date.year": year, 
        "date.month": month, 
      }); 

      const { totalIncomeSum, totalExpenseSum, expenseStatistic } =
        getStatisticByCategories(transactions);

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
      next(error)
    }
  }
}

module.exports = new Transaction();
