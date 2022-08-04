const router = require("express").Router();
const { authenticate, newTransactionValidation } = require("../middleware");
const transaction = require("../controllers/transaction");

router.get("/all", authenticate, transaction.getAllTransaction);
router.post("/add", authenticate, newTransactionValidation, transaction.addNewTransaction);
router.get("/statistic", authenticate, transaction.getStatistic);
router.get("/statistic/:year/", authenticate, transaction.getStatisticByYear);
router.get("/statistic/:year/:month", authenticate, transaction.getStatisticByMonth);

// router.get(
//  "/:id",
//  authenticate,
//  isValidId,
//  transaction.getTransactionById
// );

module.exports = router;
