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

      const test = await TransactionModel.find({ 
        owner, 
        "date.year": { $gte: 2022 },
      }); 
      const test2 = test.filter(transaction => {
        return transaction.date.month >= 8
      });
      console.log(test2);

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
      const { type, sum, date: dateString } = req.body;

      const newDate = new Date(dateString);

      const date = {
        year: newDate.getFullYear(),
        month: newDate.getMonth() + 1,
        day: newDate.getDay(),
      };

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
      // TODO: тут скорей всего нужна проверка что юзер обновился
      console.log(updatedUser); 

      // TODO: проверить есть ли другие транзакции после даты текущей транзакции и изменить в них поле balanceAfterTransaction

      const newTransaction = await TransactionModel.create({
        ...req.body,
        date,
        balanceAfterTransaction,
        owner: user._id,
      });

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
