const findNextDay = (transactions, date) => {
  let { year, month, day } = date;
  day += 1;

  const leap = new Date(year, 1, 29).getDate() === 29;
    if (leap && month === 2 && day === 30) {
      day = 1; // 1
      month = 3; // марта
    }

    if (!leap && day === 29 && month === 2) {
      day = 1;
      month = 3;
    }

    if (day === 32 && month === 12) {
      day = 1; // 1
      month = 1; // января
      year += 1; // следующего года
    }

    const monthsL = [1, 3, 5, 7, 8, 10]
    if (day === 32 && monthsL.includes(month)) {
      day = 1;
      month += 1;
    }

    const monthsS = [4, 6, 9, 10]
    if (day === 31 && monthsS.includes(month)) {
      day = 1;
      month += 1;
    }
  
  console.log(year, month, day);

  
  const result = transactions.filter(transaction => {    
    return transaction.date.year === year
      && transaction.date.month === month
      && transaction.date.day === day
  })
  console.log(result);

  if (!result || result.length === 0) {
    const newDate = {
      year,
      month,
      day
    }
    findNextDay(transactions, newDate)
  };

  return result;
};

module.exports = findNextDay;