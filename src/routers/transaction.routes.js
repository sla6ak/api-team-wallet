const router = require("express").Router();
const { authenticate } = require("../middleware");
// const { isValidId } = require("../middleware");
const transaction = require("../controllers/transaction");

router.get("/all", authenticate, transaction.getAllTransaction);

// router.get(
//  "/transaction/:id",
//  authenticate,
//  isValidId,
//  transaction.getTransactionById
// );

// router.post("/transaction", authenticate, transaction.addNewTransaction);
router.post("/add", transaction.addNewTransaction);

module.exports = router;
