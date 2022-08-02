const { categories } = require("../constants/constants");

const getStatisticByCategories = (transactions) => {
  const statistic = [];

  categories.map(async category => {
    const result = transactions.filter((transaction) => {
      return transaction.category === category;
    })

    if (result.length === 0) return;

    let totalSumByCategory = 0;
    result.map(element => {
      totalSumByCategory += element.sum;
      return element;
    })

    statistic.push({
      category,
      totalSumByCategory
    })
  })
  
  return statistic;
};

module.exports = getStatisticByCategories;