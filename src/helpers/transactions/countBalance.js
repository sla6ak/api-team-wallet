const { TRANSACTION_TYPES } = require("../../constants/constants");

const countBalance = (type, balance, sum) => {
  return type === TRANSACTION_TYPES.INCOME
    ? balance + sum
    : balance - sum
}
          
module.exports = countBalance;