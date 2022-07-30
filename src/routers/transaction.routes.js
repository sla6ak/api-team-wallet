const router = require("express").Router();
const { authenticate } = require("../middleware");
// const { isValidId } = require("../middleware");
const transaction = require("../controllers/transaction");

router.get("/transaction", authenticate, transaction.getAllTransaction);

// router.get(
//  "/transaction/:id",
//  authenticate,
//  isValidId,
//  transaction.getTransactionById
// );

router.post("/transaction", authenticate, transaction.addNewTransaction);

module.exports = router;
