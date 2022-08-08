const isLaterTransaction = (transaction, date) => {
  if (transaction.date.year === date.year) {
    if (transaction.date.month === date.month) {
      if (transaction.date.day >= date.day) {
        return true;
      }
    } else if (transaction.date.month > date.month) {
      return true;
    }
  } else if (transaction.date.year > date.year) {
    return true;
  }

  return false;
};

module.exports = isLaterTransaction;