const { CATEGORIES_EXPENSE } = require("../constants/constants");
const { TRANSACTION_TYPES } = require("../constants/constants");

const getExpenseStatistic = (transactions) => {
  const statistic = [];

  CATEGORIES_EXPENSE.forEach(async category => {
    const result = transactions.filter((transaction) => {
      return transaction.category === category;
    })

    if (result.length === 0) return;

    let totalSumByCategory = 0;

    result.forEach(element => {
      totalSumByCategory += element.sum;
    })

    statistic.push({
      category,
      totalSumByCategory
    })
  })
  
  return statistic;
}

const getStatisticByCategories = (transactions) => {
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
      expenseStatistic = getExpenseStatistic(expenseTransactions);
    };
  }

  return {
    totalIncomeSum,
    totalExpenseSum,
    expenseStatistic
  }
};

module.exports = getStatisticByCategories;