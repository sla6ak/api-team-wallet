const router = require("express").Router();
const { tokenMiddleware } = require("../middleware/tokenMiddleware");
const transaction = require("../controllers/transaction");

router.get("/transaction", tokenMiddleware, transaction.getAllTransaction);

router.post("/transaction", tokenMiddleware, transaction.addNewTransaction);

module.exports = router;
