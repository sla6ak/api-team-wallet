const { CATEGORIES } = require("../constants/constants");

const getStatisticByCategories = (transactions) => {
  const statistic = [];

  CATEGORIES.forEach(async category => {
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
};

module.exports = getStatisticByCategories;