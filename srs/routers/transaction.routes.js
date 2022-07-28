const router = require("express").Router();
const { tokenMiddelware } = require("../middleware/tokenMiddelware");
const transaction = require("../controllers/transaction");

router.get("/transaction", tokenMiddelware, transaction.getAllTransaction);

router.post("/transaction", tokenMiddelware, transaction.addNewTransaction);

module.exports = router;
