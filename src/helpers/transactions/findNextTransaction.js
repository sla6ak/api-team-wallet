const findNextTransaction = (transactions, date) => {
  let { year, month, day } = date;
  day += 1;

  const isLeapYear = new Date(year, 1, 29).getDate() === 29;
  if (isLeapYear && month === 2 && day === 30) {
    day = 1; // 1
    month = 3; // марта
  };

  if (!isLeapYear && day === 29 && month === 2) {
    day = 1; // 1
    month = 3; // марта
  };

  if (day === 32 && month === 12) {
    day = 1; // 1
    month = 1; // января
    year += 1; // следующего года
  };

  const longMonths = [1, 3, 5, 7, 8, 10]
  if (day === 32 && longMonths.includes(month)) {
    day = 1;
    month += 1;
  };

  const shortMonths = [4, 6, 9, 10];
  if (day === 31 && shortMonths.includes(month)) {
    day = 1;
    month += 1;
  };
  
  const result = transactions.filter(transaction => {    
    return transaction.date.year === year
      && transaction.date.month === month
      && transaction.date.day === day
  })

  if (!result || result.length === 0) {
    const newDate = {
      year,
      month,
      day
    }
    return findNextTransaction(transactions, newDate)
  };

  return result;
};

module.exports = findNextTransaction;