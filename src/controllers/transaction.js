const TransactionModel = require("../models/transaction");
const UserModel = require("../models/user");
const {
  getStatisticByCategories,
  isLaterTransaction,
  countBalance,
  findNextDay,
} = require("../helpers");
const { TRANSACTION_TYPES } = require("../constants/constants");

class Transaction {
  async getAllTransaction(req, res, next) {
    try {
      const user = req.user;
      const owner = user._id;

      const transactions = await TransactionModel.find({ owner }, "-createdAt -updatedAt");

      const data = {
        currentBalance: user.currentBalance,
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
            
            // eslint-disable-next-line no-unused-vars
            const updatedTransaction = await TransactionModel.findByIdAndUpdate(transaction._id, {
              balanceAfterTransaction: updatedBalanceAfterTransaction,
            }, { new: true });
            // console.log(updatedTransaction); // check
          });

        // взять первую за следующий день
        const nextDay = laterTransactionsByFullDate.filter(transaction => {
          return transaction.date.year === date.year
            && transaction.date.month === date.month
            && transaction.date.day === date.day + 1
        })
        console.log('same', nextDay)

        const test = findNextDay(laterTransactionsByFullDate, date);
        console.log('test', test);

        let prevBal;
        if (nextDay[0].type === "income") {
          prevBal = nextDay[0].balanceAfterTransaction - nextDay[0].sum
        } else if (nextDay[0].type === "expense") {
          prevBal = nextDay[0].balanceAfterTransaction + nextDay[0].sum
        }

        balanceAfterTransaction = countBalance(type, prevBal, sum);
      };

      const newTransaction = await TransactionModel.create({
        ...req.body,
        date,
        balanceAfterTransaction,
        owner: user._id,
      });

      const updatedUser =
        await UserModel.findByIdAndUpdate(
          user._id,
          { currentBalance },
          { new: true });

      const data = {
        message: "Transaction was created successfully",
        currentBalance: updatedUser.currentBalance,
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
      
      const statistic = [
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
      
      const data = {
        currentBalance: user.currentBalance,
        statistic,
      };

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

      const statistic = [
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
      
      const data = {
        currentBalance: user.currentBalance,
        statistic,
      };

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

      const statistic = [
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
      
      const data = {
        currentBalance: user.currentBalance,
        statistic,
      };

      return res.status(200).json(data);
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new Transaction();
