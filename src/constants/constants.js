const TRANSACTION_TYPES = {
  INCOME: "income",
  EXPENSE: "expense",
}
const CATEGORIES = [
  // фронт должен указывать эту категорию для income сам, по умолчанию
  "salary",
  // остальные категории для expense
  "food",
  "car",
  "children",
  "house",
  "education",
  "self care",
  "leisure",
  "other"
];

module.exports = {
  TRANSACTION_TYPES,
  CATEGORIES
}